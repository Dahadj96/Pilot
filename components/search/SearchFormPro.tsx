'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, ArrowLeftRight, Plus, X, ChevronDown } from 'lucide-react';
import { AirportAutocompletePro } from './AirportAutocompletePro';
import { Airport } from '@/lib/data/airports';

type TripType = 'round-trip' | 'one-way' | 'multi-city';

interface FlightLeg {
    id: string;
    origin: Airport | null;
    destination: Airport | null;
    date: string;
}

export function SearchFormPro() {
    const router = useRouter();
    const [tripType, setTripType] = useState<TripType>('round-trip');
    const [isSwapping, setIsSwapping] = useState(false);

    // Round-trip / One-way state
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

    // Multi-city state
    const [flightLegs, setFlightLegs] = useState<FlightLeg[]>([
        { id: '1', origin: { iata: 'ALG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria', countryCode: 'DZ' }, destination: null, date: '' },
        { id: '2', origin: null, destination: null, date: '' },
    ]);

    const [adults, setAdults] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);

    const handleSwap = () => {
        setIsSwapping(true);
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);

        setTimeout(() => setIsSwapping(false), 300);
    };

    const handleAddLeg = () => {
        if (flightLegs.length < 5) {
            const lastLeg = flightLegs[flightLegs.length - 1];
            setFlightLegs([
                ...flightLegs,
                {
                    id: Date.now().toString(),
                    origin: lastLeg.destination, // Auto-populate from previous leg's destination
                    destination: null,
                    date: '',
                },
            ]);
        }
    };

    const handleRemoveLeg = (id: string) => {
        if (flightLegs.length > 2) {
            setFlightLegs(flightLegs.filter(leg => leg.id !== id));
        }
    };

    const updateLeg = (id: string, field: keyof FlightLeg, value: any) => {
        setFlightLegs(flightLegs.map(leg =>
            leg.id === id ? { ...leg, [field]: value } : leg
        ));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (tripType === 'multi-city') {
            // Validate multi-city
            const validLegs = flightLegs.filter(leg => leg.origin && leg.destination && leg.date);
            if (validLegs.length < 2) {
                alert('Please fill in at least 2 complete flight legs');
                return;
            }
            // Multi-city search not implemented yet
            alert('Multi-city search coming soon!');
            return;
        }

        // Validate round-trip/one-way
        if (!origin || !destination || !departureDate) {
            alert('Please fill in origin, destination, and departure date');
            return;
        }

        if (tripType === 'round-trip' && !returnDate) {
            alert('Please select a return date for round-trip');
            return;
        }

        setIsSearching(true);

        const params = new URLSearchParams({
            origin: origin.iata,
            destination: destination.iata,
            departureDate,
            adults: adults.toString(),
        });

        if (tripType === 'round-trip' && returnDate) {
            params.append('returnDate', returnDate);
        }

        router.push(`/search?${params.toString()}`);
    };

    const today = new Date().toISOString().split('T')[0];

    const tripTypeLabels = {
        'round-trip': 'Round-trip',
        'one-way': 'One-way',
        'multi-city': 'Multi-city',
    };

    return (
        <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Trip Type Selector */}
            <div className="px-8 pt-6 pb-4 border-b border-[#e2e8f0]/50">
                <div className="relative inline-block">
                    <button
                        type="button"
                        onClick={() => setShowTripTypeDropdown(!showTripTypeDropdown)}
                        className="flex items-center gap-2 text-text-primary font-medium hover:text-pilot-blue transition-colors"
                    >
                        {tripTypeLabels[tripType]}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showTripTypeDropdown && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-pilot-lg border border-[#e2e8f0] py-2 z-50 min-w-[150px]">
                            {(['round-trip', 'one-way', 'multi-city'] as TripType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setTripType(type);
                                        setShowTripTypeDropdown(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left hover:bg-surface transition-colors ${tripType === type ? 'text-pilot-blue font-medium' : 'text-text-primary'
                                        }`}
                                >
                                    {tripTypeLabels[type]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Inputs */}
            <div className="p-8">
                {tripType === 'multi-city' ? (
                    // Multi-city legs
                    <div className="space-y-4">
                        {flightLegs.map((leg, index) => (
                            <div key={leg.id} className="flex items-center gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface/30 rounded-2xl p-4">
                                    <AirportAutocompletePro
                                        value={leg.origin}
                                        onChange={(airport) => updateLeg(leg.id, 'origin', airport)}
                                        placeholder="From"
                                        icon="origin"
                                    />

                                    <div className="hidden md:block w-px bg-[#e2e8f0]" />

                                    <AirportAutocompletePro
                                        value={leg.destination}
                                        onChange={(airport) => updateLeg(leg.id, 'destination', airport)}
                                        placeholder="To"
                                        icon="destination"
                                    />

                                    <div className="hidden md:block w-px bg-[#e2e8f0]" />

                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                        <input
                                            type="date"
                                            value={leg.date}
                                            onChange={(e) => updateLeg(leg.id, 'date', e.target.value)}
                                            min={today}
                                            className="w-full pl-10 pr-4 py-4 bg-transparent border-none focus:outline-none text-text-primary"
                                        />
                                    </div>
                                </div>

                                {flightLegs.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLeg(leg.id)}
                                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {flightLegs.length < 5 && (
                            <button
                                type="button"
                                onClick={handleAddLeg}
                                className="flex items-center gap-2 text-pilot-blue hover:text-pilot-blue-dark font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add flight
                            </button>
                        )}
                    </div>
                ) : (
                    // Round-trip / One-way
                    <div className="space-y-6">
                        {/* Origin and Destination */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 flex items-center bg-surface/30 rounded-2xl overflow-hidden">
                                <AirportAutocompletePro
                                    value={origin}
                                    onChange={setOrigin}
                                    placeholder="From where?"
                                    icon="origin"
                                    className="flex-1"
                                />

                                <div className="w-px h-12 bg-[#e2e8f0]" />

                                <AirportAutocompletePro
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="Where to?"
                                    icon="destination"
                                    className="flex-1"
                                />
                            </div>

                            {/* Swap Button */}
                            <button
                                type="button"
                                onClick={handleSwap}
                                className="p-3 rounded-full hover:bg-surface transition-all group"
                                disabled={!origin || !destination}
                            >
                                <ArrowLeftRight
                                    className={`w-5 h-5 text-pilot-blue transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''
                                        } group-hover:scale-110`}
                                />
                            </button>
                        </div>

                        {/* Dates and Passengers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative bg-surface/30 rounded-2xl">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    min={today}
                                    className="w-full pl-10 pr-4 py-4 bg-transparent border-none focus:outline-none rounded-2xl text-text-primary"
                                    required
                                />
                            </div>

                            {tripType === 'round-trip' && (
                                <div className="relative bg-surface/30 rounded-2xl">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        min={departureDate || today}
                                        className="w-full pl-10 pr-4 py-4 bg-transparent border-none focus:outline-none rounded-2xl text-text-primary"
                                        required
                                    />
                                </div>
                            )}

                            <div className="relative bg-surface/30 rounded-2xl">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <select
                                    value={adults}
                                    onChange={(e) => setAdults(parseInt(e.target.value))}
                                    className="w-full pl-10 pr-4 py-4 bg-transparent border-none focus:outline-none rounded-2xl text-text-primary appearance-none cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <option key={num} value={num}>
                                            {num} {num === 1 ? 'Adult' : 'Adults'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full mt-6 btn-pilot disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
