import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient } from '@/lib/amadeus/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { flightOffer } = body;

        if (!flightOffer) {
            return NextResponse.json(
                { error: 'Flight offer is required' },
                { status: 400 }
            );
        }

        // Call Amadeus Flight Availabilities Search API
        const availabilityData = await amadeusClient.checkSeatAvailability(flightOffer);

        return NextResponse.json({
            success: true,
            data: availabilityData,
        });
    } catch (error: any) {
        console.error('Seat availability API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to check seat availability' },
            { status: 500 }
        );
    }
}
