'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plane } from 'lucide-react';
import { Airport } from '@/lib/data/airports';

interface AirportAutocompleteProps {
    value: Airport | null;
    onChange: (airport: Airport | null) => void;
    placeholder: string;
    icon?: 'origin' | 'destination';
}

export function AirportAutocomplete({
    value,
    onChange,
    placeholder,
    icon = 'origin',
}: AirportAutocompleteProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Update input value when selected airport changes
    useEffect(() => {
        if (value) {
            setInputValue(`${value.city} (${value.iata})`);
        } else {
            setInputValue('');
        }
    }, [value]);

    // Debounced search function
    useEffect(() => {
        // Clear previous timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Don't search if input matches selected value
        if (value && inputValue === `${value.city} (${value.iata})`) {
            return;
        }

        // Set new timeout for 300ms debounce
        debounceRef.current = setTimeout(async () => {
            if (inputValue.length === 0) {
                // Show popular airports when empty
                setIsLoading(true);
                try {
                    const response = await fetch('/api/airports/search');
                    const data = await response.json();
                    setAirports(data.airports || []);
                } catch (error) {
                    console.error('Failed to fetch airports:', error);
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            // Search airports
            setIsLoading(true);
            try {
                const response = await fetch(`/api/airports/search?q=${encodeURIComponent(inputValue)}`);
                const data = await response.json();
                setAirports(data.airports || []);
            } catch (error) {
                console.error('Failed to search airports:', error);
            } finally {
                setIsLoading(false);
            }
        }, 200);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [inputValue, value]);

    // Reset highlighted index when airports change
    useEffect(() => {
        setHighlightedIndex(0);
    }, [airports]);

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

        // Clear selection if user is typing
        if (value) {
            onChange(null);
        }
    };

    const handleSelectAirport = (airport: Airport) => {
        onChange(airport);
        setInputValue(`${airport.city} (${airport.iata})`);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || airports.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, airports.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (airports[highlightedIndex]) {
                    handleSelectAirport(airports[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            case 'Tab':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    {icon === 'origin' ? (
                        <div className="w-3 h-3 rounded-full border-2 border-pilot-blue" />
                    ) : (
                        <Plane className="w-4 h-4 text-pilot-blue" />
                    )}
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-4 rounded-3xl border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-pilot-blue focus:border-transparent transition-all text-text-primary placeholder:text-text-secondary"
                />

                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-pilot-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && airports.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-3xl shadow-pilot-lg border border-[#e2e8f0] backdrop-blur-md max-h-80 overflow-y-auto">
                    {airports.map((airport, index) => (
                        <button
                            key={airport.iata}
                            onClick={() => handleSelectAirport(airport)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`w-full px-6 py-3 text-left transition-colors first:rounded-t-3xl last:rounded-b-3xl flex items-center justify-between group ${index === highlightedIndex ? 'bg-surface' : 'hover:bg-surface'
                                }`}
                        >
                            <div>
                                <div className={`font-medium transition-colors ${index === highlightedIndex ? 'text-pilot-blue' : 'text-text-primary group-hover:text-pilot-blue'
                                    }`}>
                                    {airport.city}
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {airport.name}
                                </div>
                            </div>
                            <div className="text-lg font-bold text-pilot-blue">
                                {airport.iata}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
