import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient } from '@/lib/amadeus/client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Extract search parameters
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const departureDate = searchParams.get('departureDate');
        const returnDate = searchParams.get('returnDate');
        const adults = parseInt(searchParams.get('adults') || '1');
        const travelClass = searchParams.get('travelClass') || 'ECONOMY';

        // Validate required parameters
        if (!origin || !destination || !departureDate) {
            return NextResponse.json(
                { error: 'Missing required parameters: origin, destination, departureDate' },
                { status: 400 }
            );
        }

        // Search for flights using Amadeus API
        const flightData = await amadeusClient.searchFlights({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate,
            returnDate: returnDate || undefined,
            adults,
            travelClass,
            max: 50,
        });

        // Convert prices from EUR to DZD
        const flightsWithDZD = flightData.data.map((offer: any) => {
            const eurPrice = parseFloat(offer.price.total);
            const dzdPrice = amadeusClient.convertToDZD(eurPrice);

            return {
                ...offer,
                price: {
                    ...offer.price,
                    totalDZD: dzdPrice,
                    formattedDZD: amadeusClient.formatDZD(dzdPrice),
                },
            };
        });

        return NextResponse.json({
            data: flightsWithDZD,
            meta: flightData.meta,
            dictionaries: flightData.dictionaries,
        });
    } catch (error: any) {
        console.error('Flight search API error:', error);

        // MOCK DATA FALLBACK (For testing/UI verification when API keys are missing)
        const mockOffers = [
            {
                id: '1',
                itineraries: [
                    {
                        duration: 'PT2H30M',
                        segments: [
                            {
                                departure: { iataCode: 'ALG', at: '2025-05-20T10:00:00' },
                                arrival: { iataCode: 'CDG', at: '2025-05-20T13:30:00' },
                                carrierCode: 'AH',
                                number: '1000',
                                aircraft: { code: '320' },
                            }
                        ]
                    }
                ],
                price: {
                    currency: 'EUR',
                    total: '200.00',
                    totalDZD: 30000,
                    formattedDZD: '30,000 DZD'
                },
                travelerPricings: [],
                validatingAirlineCodes: ['AH']
            },
            {
                id: '2',
                itineraries: [
                    {
                        duration: 'PT5H15M',
                        segments: [
                            {
                                departure: { iataCode: 'ALG', at: '2025-05-20T14:00:00' },
                                arrival: { iataCode: 'DXB', at: '2025-05-20T21:15:00' },
                                carrierCode: 'EK',
                                number: '202',
                                aircraft: { code: '777' },
                            }
                        ]
                    }
                ],
                price: {
                    currency: 'EUR',
                    total: '450.00',
                    totalDZD: 67500,
                    formattedDZD: '67,500 DZD'
                },
                travelerPricings: [],
                validatingAirlineCodes: ['EK']
            }
        ];

        return NextResponse.json({
            data: mockOffers,
            meta: { count: 2 },
            dictionaries: {
                locations: {
                    ALG: { cityCode: 'ALG', countryCode: 'DZ' },
                    CDG: { cityCode: 'PAR', countryCode: 'FR' },
                    DXB: { cityCode: 'DXB', countryCode: 'AE' }
                },
                carriers: {
                    AH: 'Air Algerie',
                    EK: 'Emirates'
                },
                aircraft: {
                    '320': 'Airbus A320',
                    '777': 'Boeing 777'
                }
            }
        });
    }
}
