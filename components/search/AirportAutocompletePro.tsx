'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import Fuse from 'fuse.js';
import { Airport, airports } from '@/lib/data/airports';

interface AirportAutocompleteProProps {
    value: Airport | null;
    onChange: (airport: Airport | null) => void;
    placeholder: string;
    icon?: 'origin' | 'destination';
    className?: string;
}

export function AirportAutocompletePro({
    value,
    onChange,
    placeholder,
    icon = 'origin',
    className = '',
}: AirportAutocompleteProProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<Airport[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initialize Fuse.js on the client side for zero-lag lookups
    const fuse = useMemo(() => {
        return new Fuse(airports, {
            keys: [
                { name: 'iata', weight: 2 },
                { name: 'city', weight: 1.5 },
                { name: 'name', weight: 1 },
                { name: 'country', weight: 0.5 },
            ],
            threshold: 0.3,
            includeScore: true,
        });
    }, []);

    // Update input value when selected airport changes
    useEffect(() => {
        if (value) {
            setInputValue(`${value.city} (${value.iata})`);
        } else {
            setInputValue('');
        }
    }, [value]);

    // Perform local search
    useEffect(() => {
        if (!inputValue || inputValue === (value ? `${value.city} (${value.iata})` : '')) {
            // Default to popular/local airports when empty
            const popular = airports
                .filter(a => a.countryCode === 'DZ')
                .concat(airports.filter(a => a.countryCode !== 'DZ').slice(0, 5))
                .slice(0, 10);
            setResults(popular);
            return;
        }

        const searchResults = fuse.search(inputValue);
        setResults(searchResults.slice(0, 10).map(r => r.item));
    }, [inputValue, fuse, value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
        if (value) onChange(null);
    };

    const handleSelectAirport = (airport: Airport) => {
        onChange(airport);
        setInputValue(`${airport.city} (${airport.iata})`);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="flex items-center gap-3 p-4">
                <div className="flex-shrink-0">
                    {icon === 'origin' ? (
                        <div className="w-2 h-2 rounded-full bg-pilot-blue shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                    ) : (
                        <MapPin className="w-5 h-5 text-pilot-blue" />
                    )}
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">
                        {icon === 'origin' ? 'From' : 'To'}
                    </span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        className="text-sm font-bold text-text-primary placeholder:text-text-secondary/60 focus:outline-none bg-transparent"
                    />
                </div>
            </div>

            {/* Glassmorphic Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((airport) => (
                        <button
                            key={airport.iata}
                            onClick={() => handleSelectAirport(airport)}
                            className="w-full px-6 py-3 text-left hover:bg-surface transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-white transition-colors">
                                    <MapPin className="w-4 h-4 text-text-secondary opacity-50" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-text-primary group-hover:text-pilot-blue transition-colors">
                                        {airport.city}
                                    </div>
                                    <div className="text-xs text-text-secondary truncate max-w-[180px]">
                                        {airport.name}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm font-black text-pilot-blue bg-pilot-blue/10 px-2 py-1 rounded-md group-hover:bg-pilot-blue group-hover:text-white transition-all uppercase tracking-wider">
                                {airport.iata}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
