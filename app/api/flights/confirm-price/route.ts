import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient } from '@/lib/amadeus/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { flightOffer } = body;

        if (!flightOffer) {
            return NextResponse.json(
                { error: 'Missing flightOffer object' },
                { status: 400 }
            );
        }

        const pricingData = await amadeusClient.confirmPrice(flightOffer);

        return NextResponse.json(pricingData);
    } catch (error: any) {
        console.error('Pricing confirmation API error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to confirm pricing' },
            { status: 500 }
        );
    }
}
