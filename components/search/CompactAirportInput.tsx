'use client';

import { useState, useEffect, useRef } from 'react';
import { Airport } from '@/lib/data/airports';

interface CompactAirportInputProps {
    value: string;
    onChange: (iataCode: string) => void;
    placeholder: string;
    className?: string;
}

export function CompactAirportInput({
    value,
    onChange,
    placeholder,
    className = ''
}: CompactAirportInputProps) {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Update input value when prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Debounced search function
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            // Only search if input is different from initial value and has at least 2 characters
            if (inputValue.length < 2 || inputValue === value) {
                setAirports([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/airports/search?q=${encodeURIComponent(inputValue)}`);
                const data = await response.json();
                setAirports(data.airports || []);
                setIsOpen(data.airports?.length > 0);
                setHighlightedIndex(0);
            } catch (error) {
                console.error('Error searching airports:', error);
                setAirports([]);
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (airport: Airport) => {
        setInputValue(airport.iata);
        onChange(airport.iata);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % airports.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + airports.length) % airports.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (airports[highlightedIndex]) {
                    handleSelect(airports[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setInputValue(val);
                    if (val.length === 3 && /^[A-Z]{3}$/.test(val)) {
                        onChange(val);
                    }
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={3}
                className={className}
            />

            {/* Dropdown */}
            {isOpen && airports.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {airports.map((airport, index) => (
                        <button
                            key={airport.iata}
                            onClick={() => handleSelect(airport)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-pilot-blue/5 transition-colors ${index === highlightedIndex ? 'bg-pilot-blue/10' : ''
                                }`}
                        >
                            <div className="font-semibold text-text-primary">
                                {airport.city} ({airport.iata})
                            </div>
                            <div className="text-text-secondary text-[10px]">
                                {airport.name}, {airport.country}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
