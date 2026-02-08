'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar as CalendarIcon, User, ArrowRightLeft } from 'lucide-react';
import { Airport } from '@/lib/data/airports';
import { AirportAutocompletePro } from './AirportAutocompletePro';

type TripType = 'round-trip' | 'one-way' | 'multi-city';

export function SearchFormSkyFlow() {
    const router = useRouter();
    const [tripType, setTripType] = useState<TripType>('round-trip');
    const [passengers, setPassengers] = useState(1);

    // Default to Algiers for demo
    const ALG_AIRPORT: Airport = {
        iata: 'ALG',
        name: 'Houari Boumediene Airport',
        city: 'Algiers',
        country: 'Algeria',
        countryCode: 'DZ',
    };

    const [origin, setOrigin] = useState<Airport | null>(ALG_AIRPORT);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleSearch = () => {
        if (!origin || !destination || !departureDate) {
            // Toast or alert here
            return;
        }

        const params = new URLSearchParams({
            origin: origin.iata,
            destination: destination.iata,
            departureDate,
            adults: passengers.toString(),
            travelClass: 'ECONOMY'
        });

        if (tripType === 'round-trip' && returnDate) {
            params.append('returnDate', returnDate);
        }

        router.push(`/search?${params.toString()}`);
    };

    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    return (
        <div className="w-full max-w-md mx-auto md:max-w-4xl">
            <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-white/50 relative overflow-hidden">

                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
                        Where are you<br className="md:hidden" /> flying to?
                    </h1>

                    {/* Trip Type Tabs */}
                    <div className="flex bg-gray-100/50 p-1 rounded-full w-full md:w-fit mb-6">
                        {(['round-trip', 'one-way', 'multi-city'] as TripType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setTripType(type)}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${tripType === type
                                        ? 'bg-white text-pilot-blue shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {type === 'round-trip' && 'Round-trip'}
                                {type === 'one-way' && 'One-way'}
                                {type === 'multi-city' && 'Multi'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Inputs Grid */}
                <div className="flex flex-col gap-4">

                    {/* Route Section */}
                    <div className="flex flex-col md:flex-row gap-4 relative">
                        {/* FROM */}
                        <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">From</span>
                            <div className="relative">
                                <AirportAutocompletePro
                                    value={origin}
                                    onChange={setOrigin}
                                    placeholder="Select Origin"
                                />
                            </div>
                        </div>

                        {/* Swap Button (Mobile: Vertical, Desktop: Horizontal) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:static md:translate-x-0 md:translate-y-0 md:flex md:items-center">
                            <button
                                onClick={handleSwap}
                                className="bg-white p-2 rounded-full shadow-md border border-gray-100 text-pilot-blue hover:scale-110 transition-transform"
                            >
                                <ArrowRightLeft className="w-5 h-5 md:rotate-0 rotate-90" />
                            </button>
                        </div>

                        {/* TO */}
                        <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">To</span>
                            <div className="relative">
                                <AirportAutocompletePro
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="Where to?"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Passengers Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Date */}
                        <div className="flex-[2] bg-gray-50/50 rounded-2xl p-4 flex items-center gap-3 border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-pilot-blue group-hover:bg-pilot-blue group-hover:text-white transition-colors">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col w-full">
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Date</span>
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="bg-transparent font-semibold text-text-primary focus:outline-none w-full"
                                    min={new Date().toISOString().split('T')[0]} // Min today
                                />
                            </div>
                            {tripType === 'round-trip' && (
                                <div className="border-l border-gray-200 pl-4 ml-2">
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Return</span>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        className="bg-transparent font-semibold text-text-primary focus:outline-none w-full"
                                        min={departureDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Passengers */}
                        <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 flex items-center gap-3 border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-pilot-blue group-hover:bg-pilot-blue group-hover:text-white transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Passengers</span>
                                <span className="font-semibold text-text-primary">{passengers} Adult{passengers > 1 && 's'}</span>
                            </div>
                            {/* Simple stepper for MVP */}
                            <div className="ml-auto flex gap-1">
                                <button onClick={(e) => { e.stopPropagation(); setPassengers(Math.max(1, passengers - 1)) }} className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300">-</button>
                                <button onClick={(e) => { e.stopPropagation(); setPassengers(Math.min(9, passengers + 1)) }} className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300">+</button>
                            </div>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="mt-2 w-full bg-pilot-blue text-white font-bold py-4 rounded-2xl shadow-pilot-lg hover:bg-pilot-blue-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Search Flights
                    </button>

                </div>
            </div>
        </div>
    );
}
