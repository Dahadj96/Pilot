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

    return (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            {/* Origin */}
            <CompactAirportInput
                value={origin}
                onChange={setOrigin}
                placeholder="From"
                className="w-16 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-2 py-1"
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
                className="w-16 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-2 py-1"
            />

            <span className="text-text-secondary mx-1">•</span>

            {/* Departure Date */}
            <div className="flex items-center gap-1 relative">
                <Calendar className="w-3 h-3 text-text-secondary absolute left-1 pointer-events-none" />
                <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-32 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-1 py-1 pl-5"
                />
            </div>

            {/* Return Date (conditional - only if original search had it) */}
            {initialReturnDate && (
                <>
                    <span className="text-text-secondary text-xs">-</span>
                    <div className="flex items-center gap-1 relative">
                        <Calendar className="w-3 h-3 text-text-secondary absolute left-1 pointer-events-none" />
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-32 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-1 py-1 pl-5"
                        />
                    </div>
                </>
            )}

            <span className="text-text-secondary mx-1">•</span>

            {/* Adults */}
            <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-text-secondary" />
                <input
                    type="number"
                    min="1"
                    max="9"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-8 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-pilot-blue rounded px-1 py-1 text-center"
                />
            </div>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className="ml-2 bg-pilot-blue text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-pilot-blue/90 transition-colors flex items-center gap-1"
            >
                <Search className="w-3 h-3" />
                Update
            </button>
        </div>
    );
}
