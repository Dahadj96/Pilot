'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import { CompactAirportInput } from './CompactAirportInput';

interface CompactSearchEditorProps {
    initialOrigin: string;
    initialDestination: string;
    initialDepartureDate: string;
    initialReturnDate?: string;
    initialAdults: string;
}

export function CompactSearchEditor({
    initialOrigin,
    initialDestination,
    initialDepartureDate,
    initialReturnDate,
    initialAdults
}: CompactSearchEditorProps) {
    const router = useRouter();
    const [origin, setOrigin] = useState(initialOrigin);
    const [destination, setDestination] = useState(initialDestination);
    const [departureDate, setDepartureDate] = useState(initialDepartureDate);
    const [returnDate, setReturnDate] = useState(initialReturnDate || '');
    const [adults, setAdults] = useState(initialAdults);

    const handleSearch = () => {
        const params = new URLSearchParams({
            origin,
            destination,
            departureDate,
            adults,
        });

        if (returnDate) {
            params.append('returnDate', returnDate);
        }

        router.push(`/search?${params.toString()}`);
    };

    const handleSwapAirports = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
            {/* Mobile Summary (Click to expand) */}
            <button
                className="md:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm font-medium text-text-primary"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>{origin}</span>
                <ArrowLeftRight className="w-3.5 h-3.5 text-text-secondary" />
                <span>{destination}</span>
                <span className="text-text-secondary">•</span>
                <span>{new Date(departureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <Search className="w-3.5 h-3.5 text-pilot-blue ml-1" />
            </button>

            {/* Editor Container */}
            <div className={`
                ${isExpanded ? 'absolute top-full right-0 mt-2 p-4 flex-col items-stretch gap-4 min-w-[300px] z-50' : 'hidden md:flex items-center gap-2'}
                bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm
            `}>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsExpanded(false)}
                    className="md:hidden absolute top-2 right-2 text-text-secondary"
                >
                    ✕
                </button>

                <div className="flex items-center gap-2 justify-between md:justify-start">
                    {/* Origin */}
                    <CompactAirportInput
                        value={origin}
                        onChange={setOrigin}
                        placeholder="From"
                        className="w-16 md:w-16 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-2 py-1"
                    />

                    {/* Swap Button */}
                    <button
                        onClick={handleSwapAirports}
                        title="Swap airports"
                        className="text-text-secondary hover:text-pilot-blue hover:bg-pilot-blue/5 rounded p-1 transition-colors"
                    >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Destination */}
                    <CompactAirportInput
                        value={destination}
                        onChange={setDestination}
                        placeholder="To"
                        className="w-16 md:w-16 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-2 py-1"
                    />
                </div>

                <div className="flex md:items-center gap-2 flex-col md:flex-row">
                    <span className="hidden md:inline text-text-secondary mx-1">•</span>

                    {/* Departure Date */}
                    <div className="flex items-center gap-1 relative w-full md:w-auto">
                        <Calendar className="w-3 h-3 text-text-secondary absolute left-1 pointer-events-none" />
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="w-full md:w-32 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-1 py-1 pl-5"
                        />
                    </div>

                    {/* Return Date */}
                    {initialReturnDate && (
                        <>
                            <span className="hidden md:inline text-text-secondary text-xs">-</span>
                            <div className="flex items-center gap-1 relative w-full md:w-auto">
                                <Calendar className="w-3 h-3 text-text-secondary absolute left-1 pointer-events-none" />
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full md:w-32 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-1 py-1 pl-5"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between md:justify-start gap-2">
                    <span className="hidden md:inline text-text-secondary mx-1">•</span>

                    {/* Adults */}
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-text-secondary" />
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={adults}
                            onChange={(e) => setAdults(e.target.value)}
                            className="w-full md:w-8 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-1 py-1 text-center"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="ml-0 md:ml-2 w-full md:w-auto bg-pilot-blue text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-pilot-blue/90 transition-colors flex items-center justify-center gap-1"
                    >
                        <Search className="w-3 h-3" />
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
