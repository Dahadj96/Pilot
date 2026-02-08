'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlightCard } from '@/components/flights/FlightCard';
import { FlightSkeleton } from '@/components/flights/FlightSkeleton';
import { FilterBar } from '@/components/filters/FilterBar';
import { CompactSearchEditor } from '@/components/search/CompactSearchEditor';
import { FilterSortFloating } from '@/components/search/FilterSortFloating';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
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
        <main className="min-h-screen bg-surface pb-24 md:pb-0 relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] px-6 py-4 sticky top-0 z-40 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-text-primary" />
                        </Link>

                        {/* Mobile Summary */}
                        <div className="md:hidden flex flex-col">
                            <div className="font-bold text-sm text-text-primary flex items-center gap-2">
                                {origin} <span className="text-gray-400">→</span> {destination}
                            </div>
                            <div className="text-xs text-text-secondary">
                                {departureDate} • {adults} Adult{Number(adults) > 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Desktop Logo */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-8 h-8 bg-pilot-blue rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-2xl font-bold text-text-primary">Pilot</span>
                        </div>
                    </div>

                    {/* Desktop Search Editor */}
                    <div className="hidden md:block">
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
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">

                {/* Stats & Sort Bar */}
                {!isLoading && !error && flights.length > 0 && (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-text-primary hidden md:block">Select Flight</h1>
                            <p className="text-text-secondary text-sm">Found {flights.length} flights</p>
                        </div>

                        {/* Desktop Sort Tabs */}
                        <div className="hidden md:flex p-1 bg-white rounded-full border border-gray-200 shadow-sm">
                            {['cheapest', 'best', 'fastest'].map((sort) => (
                                <button
                                    key={sort}
                                    onClick={() => setSortBy(sort as any)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${sortBy === sort
                                        ? 'bg-pilot-blue text-white shadow-md'
                                        : 'text-text-secondary hover:bg-gray-50'
                                        }`}
                                >
                                    {sort}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results List */}
                <div className="space-y-4">
                    {isLoading && (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <FlightSkeleton key={i} />
                            ))}
                        </>
                    )}

                    {error && (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Search Failed</h3>
                            <p className="text-text-secondary mb-6">{error}</p>
                            <Link href="/" className="btn-pilot inline-block">
                                Try Again
                            </Link>
                        </div>
                    )}

                    {!isLoading && !error && flights.length === 0 && (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✈️</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">No flights found</h3>
                            <p className="text-text-secondary mb-6">We couldn't find any flights for your dates.</p>
                            <Link href="/" className="btn-pilot inline-block">
                                New Search
                            </Link>
                        </div>
                    )}

                    {!isLoading && !error && sortedFlights.map((flight) => (
                        <FlightCard key={flight.id} offer={flight} dictionaries={dictionaries} />
                    ))}
                </div>
            </div>

            <FilterSortFloating />
        </main>
    );
}
