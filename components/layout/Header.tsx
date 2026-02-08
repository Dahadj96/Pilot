'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="px-6 py-4 relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pilot-blue to-pilot-blue-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <span className="text-2xl font-bold text-pilot-primary tracking-tight group-hover:text-pilot-blue transition-colors duration-300">Pilot</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/search" className="text-text-secondary hover:text-pilot-blue font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pilot-blue after:transition-all hover:after:w-full">
                        Flights
                    </Link>
                    <button className="text-text-secondary hover:text-pilot-blue font-medium transition-colors">
                        My Trips
                    </button>
                    <button className="px-6 py-2.5 rounded-full border-2 border-pilot-blue text-pilot-blue font-semibold hover:bg-pilot-blue hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                        Sign In
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-pilot-primary hover:bg-pilot-blue/5 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav Dropdown - Glassmorphism */}
            {isMenuOpen && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl md:hidden animate-in slide-in-from-top-4 fade-in-0 z-50 overflow-hidden">
                    <div className="flex flex-col p-2">
                        <Link
                            href="/search"
                            className="text-lg font-medium text-text-primary px-4 py-3 hover:bg-pilot-blue/5 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Flights
                        </Link>
                        <button
                            className="text-lg font-medium text-text-primary px-4 py-3 text-left hover:bg-pilot-blue/5 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My Trips
                        </button>
                        <div className="p-2 mt-2 border-t border-gray-100">
                            <button
                                className="w-full bg-pilot-blue text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-pilot-blue-dark transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
