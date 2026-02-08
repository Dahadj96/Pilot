import axios from 'axios';

interface AmadeusToken {
    access_token: string;
    expires_at: number;
}

class AmadeusClient {
    private token: AmadeusToken | null = null;
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiKey = process.env.AMADEUS_API_KEY!;
        this.apiSecret = process.env.AMADEUS_API_SECRET!;
        this.baseUrl = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
    }

    /**
     * Get a valid access token, refreshing if necessary
     */
    private async getAccessToken(): Promise<string> {
        // Check if we have a valid token
        if (this.token && this.token.expires_at > Date.now()) {
            return this.token.access_token;
        }

        // Request a new token
        try {
            const response = await axios.post(
                `${this.baseUrl}/v1/security/oauth2/token`,
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.apiKey,
                    client_secret: this.apiSecret,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const { access_token, expires_in } = response.data;

            // Cache the token with expiry time (subtract 60s for safety margin)
            this.token = {
                access_token,
                expires_at: Date.now() + (expires_in - 60) * 1000,
            };

            return access_token;
        } catch (error) {
            console.error('Failed to get Amadeus access token:', error);
            throw new Error('Authentication failed');
        }
    }

    /**
     * Search for flight offers
     */
    async searchFlights(params: {
        originLocationCode: string;
        destinationLocationCode: string;
        departureDate: string;
        adults: number;
        returnDate?: string;
        travelClass?: string;
        max?: number;
    }) {
        const token = await this.getAccessToken();

        try {
            const response = await axios.get(
                `${this.baseUrl}/v2/shopping/flight-offers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        originLocationCode: params.originLocationCode,
                        destinationLocationCode: params.destinationLocationCode,
                        departureDate: params.departureDate,
                        adults: params.adults,
                        ...(params.returnDate && { returnDate: params.returnDate }),
                        ...(params.travelClass && { travelClass: params.travelClass }),
                        max: params.max || 50,
                        currencyCode: 'EUR', // We'll convert to DZD
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Amadeus flight search error:', error.response?.data || error.message);
            throw new Error('Flight search failed');
        }
    }

    /**
     * Check seat availability for a specific flight offer
     * This is called on-demand to minimize API costs
     */
    async checkSeatAvailability(flightOffer: any) {
        const token = await this.getAccessToken();

        try {
            const response = await axios.post(
                `${this.baseUrl}/v1/shopping/availability/flight-availabilities`,
                flightOffer,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-HTTP-Method-Override': 'GET',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Amadeus seat availability error:', error.response?.data || error.message);
            throw new Error('Seat availability check failed');
        }
    }

    /**
     * Confirm final pricing for a flight offer
     */
    async confirmPrice(flightOffer: any) {
        const token = await this.getAccessToken();

        try {
            const response = await axios.post(
                `${this.baseUrl}/v1/shopping/flight-offers/pricing`,
                {
                    data: {
                        type: 'flight-offers-pricing',
                        flightOffers: [flightOffer]
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Amadeus pricing confirmation error:', error.response?.data || error.message);
            throw new Error('Pricing confirmation failed');
        }
    }

    /**
     * Create a flight order (PNR)
     */
    async createOrder(flightOffer: any, travelers: any[]) {
        const token = await this.getAccessToken();

        try {
            const response = await axios.post(
                `${this.baseUrl}/v1/booking/flight-orders`,
                {
                    data: {
                        type: 'flight-order',
                        flightOffers: [flightOffer],
                        travelers: travelers
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Amadeus booking error:', error.response?.data || error.message);
            throw new Error('Flight booking failed');
        }
    }

    /**
     * Convert EUR to DZD (1 EUR ≈ 145 DZD)
     */
    convertToDZD(eurAmount: number): number {
        return Math.round(eurAmount * 145);
    }

    /**
     * Format price in DZD
     */
    formatDZD(amount: number): string {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }
}

// Export a singleton instance
export const amadeusClient = new AmadeusClient();
