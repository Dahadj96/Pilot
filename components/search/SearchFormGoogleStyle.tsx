'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, ArrowLeftRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Airport } from '@/lib/data/airports';
import { AirportAutocompletePro } from './AirportAutocompletePro';

type TripType = 'round-trip' | 'one-way' | 'multi-city';
type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

interface PassengerCount {
    adults: number;
    children: number;
    infants: number;
}

interface FlightLeg {
    id: string;
    origin: Airport | null;
    destination: Airport | null;
    date: string;
}

export function SearchFormGoogleStyle() {
    const router = useRouter();
    const [tripType, setTripType] = useState<TripType>('round-trip');
    const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
    const [passengers, setPassengers] = useState<PassengerCount>({ adults: 1, children: 0, infants: 0 });

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

    // Multi-city state
    const [flightLegs, setFlightLegs] = useState<FlightLeg[]>([
        {
            id: '1',
            origin: ALG_AIRPORT,
            destination: null,
            date: '',
        },
        {
            id: '2',
            origin: null,
            destination: null,
            date: '',
        },
    ]);

    const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [showCabinDropdown, setShowCabinDropdown] = useState(false);

    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const updatePassengers = (type: keyof PassengerCount, delta: number) => {
        setPassengers(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta),
        }));
    };

    const totalPassengers = passengers.adults + passengers.children + passengers.infants;

    // Multi-city functions
    const addFlightLeg = () => {
        if (flightLegs.length >= 5) return; // Max 5 legs

        const lastLeg = flightLegs[flightLegs.length - 1];
        setFlightLegs([
            ...flightLegs,
            {
                id: Date.now().toString(),
                origin: lastLeg.destination, // Auto-populate from previous destination
                destination: null,
                date: '',
            },
        ]);
    };

    const removeFlightLeg = (id: string) => {
        if (flightLegs.length <= 2) return; // Minimum 2 legs
        setFlightLegs(flightLegs.filter(leg => leg.id !== id));
    };

    const updateFlightLeg = (id: string, updates: Partial<FlightLeg>) => {
        setFlightLegs(flightLegs.map(leg =>
            leg.id === id ? { ...leg, ...updates } : leg
        ));
    };

    const handleSearch = () => {
        if (!origin || !destination || !departureDate) {
            alert('Please fill in all required fields');
            return;
        }

        const params = new URLSearchParams({
            origin: origin.iata,
            destination: destination.iata,
            departureDate,
            adults: passengers.adults.toString(),
            travelClass: cabinClass.toUpperCase().replace('-', '_'), // Convert to API format
        });

        if (tripType === 'round-trip' && returnDate) {
            params.append('returnDate', returnDate);
        }

        router.push(`/search?${params.toString()}`);
    };

    const tripTypeLabels = {
        'round-trip': 'Round trip',
        'one-way': 'One way',
        'multi-city': 'Multi-city',
    };

    const cabinLabels = {
        'economy': 'Economy',
        'premium-economy': 'Premium economy',
        'business': 'Business',
        'first': 'First',
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Top Controls - Glassmorphic Pill */}
            <div className="inline-flex items-center gap-1 mb-6 p-1.5 glass-pill rounded-full transition-all duration-500 hover:soft-shadow">
                {/* Trip Type */}
                <div className="relative">
                    <button
                        onClick={() => setShowTripTypeDropdown(!showTripTypeDropdown)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-primary hover:bg-black/5 rounded-full transition-all duration-300"
                    >
                        <ArrowLeftRight className="w-4 h-4 text-pilot-blue" />
                        {tripTypeLabels[tripType]}
                        <ChevronDown className="w-4 h-4 text-text-secondary opacity-50" />
                    </button>

                    {showTripTypeDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-2 z-50 min-w-[150px]">
                            {(['round-trip', 'one-way', 'multi-city'] as TripType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setTripType(type);
                                        setShowTripTypeDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors"
                                >
                                    {tripTypeLabels[type]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Passengers */}
                <div className="relative">
                    <button
                        onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-primary hover:bg-black/5 rounded-full transition-all duration-300 border-x border-gray-100"
                    >
                        <span className="text-pilot-blue">👤</span>
                        {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
                        <ChevronDown className="w-4 h-4 text-text-secondary opacity-50" />
                    </button>

                    {showPassengerDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] p-4 z-50 min-w-[280px]">
                            {/* Adults */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-sm font-medium">Adults</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePassengers('adults', -1)}
                                        disabled={passengers.adults <= 1}
                                        className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center">{passengers.adults}</span>
                                    <button
                                        onClick={() => updatePassengers('adults', 1)}
                                        className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center hover:bg-surface"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-sm font-medium">Children</div>
                                    <div className="text-xs text-text-secondary">Aged 2-11</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePassengers('children', -1)}
                                        disabled={passengers.children <= 0}
                                        className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center">{passengers.children}</span>
                                    <button
                                        onClick={() => updatePassengers('children', 1)}
                                        className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center hover:bg-surface"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Infants */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-sm font-medium">Infants</div>
                                    <div className="text-xs text-text-secondary">In seat</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePassengers('infants', -1)}
                                        disabled={passengers.infants <= 0}
                                        className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center">{passengers.infants}</span>
                                    <button
                                        onClick={() => updatePassengers('infants', 1)}
                                        className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center hover:bg-surface"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
                                <button
                                    onClick={() => setShowPassengerDropdown(false)}
                                    className="px-4 py-2 text-sm text-pilot-blue hover:bg-surface rounded-lg"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cabin Class */}
                <div className="relative">
                    <button
                        onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-primary hover:bg-black/5 rounded-full transition-all duration-300"
                    >
                        {cabinLabels[cabinClass]}
                        <ChevronDown className="w-4 h-4 text-text-secondary opacity-50" />
                    </button>

                    {showCabinDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-2 z-50 min-w-[180px]">
                            {(['economy', 'premium-economy', 'business', 'first'] as CabinClass[]).map((cabin) => (
                                <button
                                    key={cabin}
                                    onClick={() => {
                                        setCabinClass(cabin);
                                        setShowCabinDropdown(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors ${cabinClass === cabin ? 'text-pilot-blue' : ''
                                        }`}
                                >
                                    {cabin === cabinClass && <span className="mr-2">✓</span>}
                                    {cabinLabels[cabin]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Search Bar - Glassmorphic Container */}
            <div className="glass-card p-4 rounded-[2.5rem] transition-all duration-500 hover:soft-shadow">
                {tripType === 'multi-city' ? (
                    <div className="space-y-4">
                        {flightLegs.map((leg, index) => (
                            <div key={leg.id} className="relative bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:bg-white/80 group">
                                <div className="flex flex-col md:flex-row items-stretch md:items-center">
                                    {/* Origin */}
                                    <div className="relative flex-1">
                                        <AirportAutocompletePro
                                            value={leg.origin}
                                            onChange={(airport) => updateFlightLeg(leg.id, { origin: airport })}
                                            placeholder="Where from?"
                                            icon="origin"
                                        />
                                    </div>

                                    {/* Swap Button */}
                                    <div className="flex items-center justify-center px-1">
                                        <button
                                            onClick={() => {
                                                const temp = leg.origin;
                                                updateFlightLeg(leg.id, {
                                                    origin: leg.destination,
                                                    destination: temp,
                                                });
                                            }}
                                            className="p-2 hover:bg-black/5 rounded-full transition-all duration-300"
                                            disabled={!leg.origin || !leg.destination}
                                        >
                                            <ArrowLeftRight className="w-4 h-4 text-text-secondary opacity-50 group-hover:opacity-100" />
                                        </button>
                                    </div>

                                    {/* Destination */}
                                    <div className="relative flex-1">
                                        <AirportAutocompletePro
                                            value={leg.destination}
                                            onChange={(airport) => {
                                                updateFlightLeg(leg.id, { destination: airport });
                                                // Auto-populate next leg's origin
                                                const nextLegIndex = flightLegs.findIndex(l => l.id === leg.id) + 1;
                                                if (nextLegIndex < flightLegs.length) {
                                                    updateFlightLeg(flightLegs[nextLegIndex].id, { origin: airport });
                                                }
                                            }}
                                            placeholder={index === 0 ? "Where to?" : leg.origin ? `From ${leg.origin.city}` : "Where to?"}
                                            icon="destination"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="relative w-full md:w-48 bg-black/5 md:bg-transparent p-4 flex items-center gap-3">
                                        <CalendarIcon className="w-5 h-5 text-pilot-blue" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Departure</span>
                                            <input
                                                type="date"
                                                value={leg.date}
                                                onChange={(e) => updateFlightLeg(leg.id, { date: e.target.value })}
                                                min={today}
                                                className="text-sm font-bold text-text-primary focus:outline-none bg-transparent cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Remove Button (for legs after the first two) */}
                                    {index >= 2 && (
                                        <div className="absolute -right-3 -top-3">
                                            <button
                                                onClick={() => removeFlightLeg(leg.id)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-text-secondary hover:text-red-500 transition-all hover:scale-110"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add Flight Button */}
                        <div className="pt-2">
                            {flightLegs.length < 5 && (
                                <button
                                    onClick={addFlightLeg}
                                    className="px-6 py-2.5 text-sm font-bold text-pilot-blue hover:bg-pilot-blue/10 border-2 border-dashed border-pilot-blue/30 rounded-full transition-all duration-300 flex items-center gap-2"
                                >
                                    <span className="text-lg">+</span> Add another flight
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <div className="flex-1 flex flex-col md:flex-row items-center bg-white/60 rounded-2xl border border-white/40 divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-visible w-full">
                            {/* Origin */}
                            <div className="relative flex-1 w-full">
                                <AirportAutocompletePro
                                    value={origin}
                                    onChange={setOrigin}
                                    placeholder="Where from?"
                                    icon="origin"
                                />
                            </div>

                            {/* Swap Button */}
                            <div className="relative h-0 md:h-auto w-full md:w-auto flex justify-center z-10">
                                <button
                                    onClick={handleSwap}
                                    className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-100 transition-all duration-300 md:-mx-4 group hover:scale-110 active:scale-95"
                                    disabled={!origin || !destination}
                                >
                                    <ArrowLeftRight className="w-5 h-5 text-pilot-blue transition-transform group-hover:rotate-180" />
                                </button>
                            </div>

                            {/* Destination */}
                            <div className="relative flex-1 w-full">
                                <AirportAutocompletePro
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="Where to?"
                                    icon="destination"
                                />
                            </div>

                            {/* Departure Date */}
                            <div className="relative flex-1 w-full">
                                <div className="p-4 flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-pilot-blue" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Departure</span>
                                        <input
                                            type="date"
                                            value={departureDate}
                                            onChange={(e) => setDepartureDate(e.target.value)}
                                            min={today}
                                            className="text-sm font-bold text-text-primary focus:outline-none bg-transparent cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Return Date (if round-trip) */}
                            {tripType === 'round-trip' && (
                                <div className="relative flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100">
                                    <div className="p-4 flex items-center gap-3">
                                        <CalendarIcon className="w-5 h-5 text-pilot-blue" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Return</span>
                                            <input
                                                type="date"
                                                value={returnDate}
                                                onChange={(e) => setReturnDate(e.target.value)}
                                                min={departureDate || today}
                                                className="text-sm font-bold text-text-primary focus:outline-none bg-transparent cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Search Button */}
                <div className="flex justify-center mt-8 px-4">
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-4 bg-pilot-blue text-white text-lg font-black rounded-full hover:bg-pilot-blue-dark transition-all duration-300 shadow-[0_8px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_30px_-5px_rgba(37,99,235,0.5)] hover:-translate-y-1 active:translate-y-0 active:shadow-inner uppercase tracking-wider group"
                    >
                        <Search className="w-5 h-5 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                        {tripType === 'multi-city' ? 'Search Flights' : 'Explore Results'}
                    </button>
                </div>
            </div>
        </div>
    );
}
