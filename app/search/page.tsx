'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlightCard } from '@/components/flights/FlightCard';
import { FlightSkeleton } from '@/components/flights/FlightSkeleton';
import { FilterBar } from '@/components/filters/FilterBar';
import { CompactSearchEditor } from '@/components/search/CompactSearchEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [flights, setFlights] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'best'>('cheapest');

    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = searchParams.get('adults');
    const travelClass = searchParams.get('travelClass');

    useEffect(() => {
        const fetchFlights = async () => {
            if (!origin || !destination || !departureDate) {
                setError('Missing search parameters');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    origin,
                    destination,
                    departureDate,
                    adults: adults || '1',
                });

                if (returnDate) {
                    params.append('returnDate', returnDate);
                }

                if (travelClass) {
                    params.append('travelClass', travelClass);
                }

                const response = await fetch(`/api/flights/search?${params.toString()}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch flights');
                }

                const data = await response.json();
                setFlights(data.data || []);
                setDictionaries(data.dictionaries);
            } catch (err: any) {
                setError(err.message || 'Failed to search flights');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlights();
    }, [origin, destination, departureDate, returnDate, adults, travelClass]);

    // Sort flights
    const sortedFlights = [...flights].sort((a, b) => {
        if (sortBy === 'cheapest') {
            return a.price.totalDZD - b.price.totalDZD;
        } else if (sortBy === 'fastest') {
            const aDuration = a.itineraries[0].duration;
            const bDuration = b.itineraries[0].duration;
            return aDuration.localeCompare(bDuration);
        }
        // 'best' - balance of price and duration
        const aScore = a.price.totalDZD * 0.7 + parseInt(a.itineraries[0].duration.match(/\d+/)?.[0] || '0') * 0.3;
        const bScore = b.price.totalDZD * 0.7 + parseInt(b.itineraries[0].duration.match(/\d+/)?.[0] || '0') * 0.3;
        return aScore - bScore;
    });

    return (
        <main className="min-h-screen bg-surface">
            {/* Header */}
            <header className="bg-white border-b border-[#e2e8f0] px-6 py-4 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <ArrowLeft className="w-5 h-5 text-text-secondary" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-pilot-blue rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">P</span>
                                </div>
                                <span className="text-2xl font-bold text-text-primary">Pilot</span>
                            </div>
                        </Link>
                    </div>

                    {origin && destination && departureDate && (
                        <CompactSearchEditor
                            initialOrigin={origin}
                            initialDestination={destination}
                            initialDepartureDate={departureDate}
                            initialReturnDate={returnDate || undefined}
                            initialAdults={adults || '1'}
                        />
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Sort Tabs & Filter Bar */}
                {!isLoading && !error && flights.length > 0 && (
                    <div className="mb-6 space-y-4">
                        {/* Sort Tabs */}
                        <div className="flex p-1.5 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/40 shadow-sm w-fit gap-1">
                            <button
                                onClick={() => setSortBy('cheapest')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${sortBy === 'cheapest'
                                    ? 'bg-pilot-blue text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                                    : 'text-text-secondary hover:bg-white/60'
                                    }`}
                            >
                                Cheapest
                            </button>
                            <button
                                onClick={() => setSortBy('fastest')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${sortBy === 'fastest'
                                    ? 'bg-pilot-blue text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                                    : 'text-text-secondary hover:bg-white/60'
                                    }`}
                            >
                                Fastest
                            </button>
                            <button
                                onClick={() => setSortBy('best')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${sortBy === 'best'
                                    ? 'bg-pilot-blue text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                                    : 'text-text-secondary hover:bg-white/60'
                                    }`}
                            >
                                Best
                            </button>
                        </div>

                        {/* Filter Bar */}
                        <FilterBar />
                    </div>
                )}

                {/* Results */}
                <div className="space-y-4">
                    {isLoading && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <FlightSkeleton key={i} />
                            ))}
                        </>
                    )}

                    {error && (
                        <div className="card-pilot p-12 text-center">
                            <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
                            <div className="text-text-secondary">{error}</div>
                            <Link href="/" className="btn-pilot mt-6 inline-block">
                                Back to Search
                            </Link>
                        </div>
                    )}

                    {!isLoading && !error && flights.length === 0 && (
                        <div className="card-pilot p-12 text-center">
                            <div className="text-text-primary text-lg font-semibold mb-2">No flights found</div>
                            <div className="text-text-secondary mb-6">
                                Try adjusting your search criteria or dates
                            </div>
                            <Link href="/" className="btn-pilot inline-block">
                                New Search
                            </Link>
                        </div>
                    )}

                    {!isLoading && !error && sortedFlights.map((flight) => (
                        <FlightCard key={flight.id} offer={flight} dictionaries={dictionaries} />
                    ))}
                </div>

                {/* Results Count */}
                {!isLoading && !error && flights.length > 0 && (
                    <div className="mt-8 text-center text-text-secondary">
                        Showing {flights.length} flight{flights.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </main>
    );
}
