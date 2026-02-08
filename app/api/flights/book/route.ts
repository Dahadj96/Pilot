import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient } from '@/lib/amadeus/client';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { flightOffer, travelers } = body;

        if (!flightOffer || !travelers || !Array.isArray(travelers)) {
            return NextResponse.json(
                { error: 'Missing flightOffer or travelers array' },
                { status: 400 }
            );
        }

        // Get Supabase server client
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('Booking attempt without authenticated user. Using guest flow.');
            // For the purpose of this pilot/demo, we'll allow guest bookings 
            // if no user is found, but we'll log it.
            // In a real app, you'd strictly return 401.
        }

        // Create flight order (PNR) via Amadeus
        const bookingData = await amadeusClient.createOrder(flightOffer, travelers);

        const pnrReference = bookingData.data.associatedRecords?.[0]?.reference;
        const orderId = bookingData.data.id;

        if (!pnrReference) {
            throw new Error('Failed to generate PNR reference from Amadeus');
        }

        // Extract basic info for database storage
        const firstItinerary = flightOffer.itineraries[0];
        const firstSegment = firstItinerary.segments[0];
        const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

        const origin = firstSegment.departure.iataCode;
        const destination = lastSegment.arrival.iataCode;
        const departureDate = firstSegment.departure.at;
        const totalPrice = flightOffer.price.totalDZD || amadeusClient.convertToDZD(parseFloat(flightOffer.price.total));

        // Save booking to Supabase
        const { error: dbError } = await supabase
            .from('bookings')
            .insert({
                user_id: user?.id || null, // Allow guest bookings
                pnr_reference: pnrReference,
                amadeus_order_id: orderId,
                origin,
                destination,
                departure_date: departureDate,
                total_price: totalPrice,
                status: 'CONFIRMED',
                flight_offer_data: flightOffer // Store full offer for reference
            });

        if (dbError) {
            console.error('Supabase booking storage error:', dbError);
            // We don't throw here because the PNR was already generated,
            // but we should log it.
        }

        return NextResponse.json({
            success: true,
            pnr: pnrReference,
            orderId,
            booking: bookingData.data
        });
    } catch (error: any) {
        console.error('Booking API error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to complete booking' },
            { status: 500 }
        );
    }
}
