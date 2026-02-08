import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import { airports } from '@/lib/data/airports';

// Configure Fuse.js for fuzzy search
const fuse = new Fuse(airports, {
    keys: [
        { name: 'iata', weight: 2 },
        { name: 'city', weight: 1.5 },
        { name: 'name', weight: 1 },
        { name: 'country', weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';

        // If no query, return popular airports (Algerian airports first)
        if (!query || query.length < 1) {
            const popularAirports = airports
                .filter(a => a.countryCode === 'DZ')
                .concat(airports.filter(a => a.countryCode !== 'DZ').slice(0, 10));

            return NextResponse.json({ airports: popularAirports.slice(0, 10) });
        }

        // Perform fuzzy search
        const results = fuse.search(query);

        // Extract airports from results and limit to 10
        const matchedAirports = results
            .slice(0, 10)
            .map(result => result.item);

        return NextResponse.json({ airports: matchedAirports });
    } catch (error) {
        console.error('Airport search error:', error);
        return NextResponse.json(
            { error: 'Failed to search airports' },
            { status: 500 }
        );
    }
}
