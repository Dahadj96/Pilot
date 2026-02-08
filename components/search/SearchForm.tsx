'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users } from 'lucide-react';
import { AirportAutocomplete } from './AirportAutocomplete';
import { Airport } from '@/lib/data/airports';

export function SearchForm() {
    const router = useRouter();
    const [origin, setOrigin] = useState<Airport | null>({
        iata: 'ALG',
        name: 'Houari Boumediene Airport',
        city: 'Algiers',
        country: 'Algeria',
        countryCode: 'DZ',
    });
    const [destination, setDestination] = useState<Airport | null>(null);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!origin || !destination || !departureDate) {
            alert('Please fill in origin, destination, and departure date');
            return;
        }

        setIsSearching(true);

        // Build search URL
        const params = new URLSearchParams({
            origin: origin.iata,
            destination: destination.iata,
            departureDate,
            adults: adults.toString(),
        });

        if (returnDate) {
            params.append('returnDate', returnDate);
        }

        // Navigate to search results page
        router.push(`/search?${params.toString()}`);
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSearch} className="glass-card p-8 rounded-3xl shadow-pilot-lg">
            <div className="space-y-6">
                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AirportAutocomplete
                        value={origin}
                        onChange={setOrigin}
                        placeholder="From where?"
                        icon="origin"
                    />

                    <AirportAutocomplete
                        value={destination}
                        onChange={setDestination}
                        placeholder="Where to?"
                        icon="destination"
                    />
                </div>

                {/* Dates and Passengers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Departure Date */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            min={today}
                            className="w-full pl-12 pr-4 py-4 rounded-3xl border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-pilot-blue focus:border-transparent transition-all text-text-primary"
                            required
                        />
                    </div>

                    {/* Return Date */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={departureDate || today}
                            placeholder="Return (optional)"
                            className="w-full pl-12 pr-4 py-4 rounded-3xl border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-pilot-blue focus:border-transparent transition-all text-text-primary"
                        />
                    </div>

                    {/* Passengers */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Users className="w-4 h-4" />
                        </div>
                        <select
                            value={adults}
                            onChange={(e) => setAdults(parseInt(e.target.value))}
                            className="w-full pl-12 pr-4 py-4 rounded-3xl border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-pilot-blue focus:border-transparent transition-all text-text-primary appearance-none cursor-pointer"
                        >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'Adult' : 'Adults'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={isSearching || !origin || !destination || !departureDate}
                    className="w-full btn-pilot disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSearching ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Searching flights...
                        </>
                    ) : (
                        <>
                            <Calendar className="w-5 h-5" />
                            Search Flights
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
