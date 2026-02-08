'use client';

import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function FilterSortFloating() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden flex gap-3">
            <button className="bg-text-primary text-white px-5 py-3 rounded-full shadow-pilot-lg flex items-center gap-2 font-bold text-sm active:scale-95 transition-transform backdrop-blur-md bg-opacity-90">
                <SlidersHorizontal className="w-4 h-4" />
                Filter
            </button>
            <button className="bg-white text-text-primary px-5 py-3 rounded-full shadow-pilot-lg flex items-center gap-2 font-bold text-sm active:scale-95 transition-transform border border-gray-100">
                <ArrowUpDown className="w-4 h-4" />
                Sort
            </button>
        </div>
    );
}
