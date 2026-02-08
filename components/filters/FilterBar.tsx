'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterChip {
    id: string;
    label: string;
    active: boolean;
}

interface FilterBarProps {
    onFilterChange?: (filters: any) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
    const [filters, setFilters] = useState<FilterChip[]>([
        { id: 'stops', label: 'Stops', active: false },
        { id: 'airlines', label: 'Airlines', active: false },
        { id: 'price', label: 'Price', active: false },
        { id: 'times', label: 'Times', active: false },
    ]);

    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const toggleFilter = (id: string) => {
        setFilters(filters.map(f =>
            f.id === id ? { ...f, active: !f.active } : f
        ));
    };

    const activeFiltersCount = filters.filter(f => f.active).length;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Chips */}
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => toggleFilter(filter.id)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 border ${filter.active
                            ? 'bg-pilot-blue text-white border-pilot-blue shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                            : 'bg-white/60 backdrop-blur-md text-text-secondary hover:bg-white border-white/40 shadow-sm'
                            }`}
                    >
                        {filter.label}
                        {filter.active && <X className="w-3.5 h-3.5" />}
                    </button>
                ))}

                {/* Advanced Filters Button */}
                <button
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className="px-6 py-2 rounded-full bg-white/60 backdrop-blur-md text-text-secondary hover:bg-white transition-all border border-white/40 shadow-sm flex items-center gap-2 text-sm font-bold"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    More filters
                    {activeFiltersCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-pilot-blue text-white text-[10px] rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Panel (placeholder for future implementation) */}
            {showFilterPanel && (
                <div className="mt-4 p-6 bg-white rounded-2xl shadow-pilot-lg border border-[#e2e8f0]">
                    <div className="text-center text-text-secondary py-8">
                        Advanced filters coming soon...
                    </div>
                </div>
            )}
        </div>
    );
}
