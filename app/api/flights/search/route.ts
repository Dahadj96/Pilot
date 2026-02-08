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
        return NextResponse.json(
            { error: error.message || 'Failed to search flights' },
            { status: 500 }
        );
    }
}
