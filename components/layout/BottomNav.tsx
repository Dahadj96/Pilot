'use client';

import Link from 'next/link';
import { Home, Ticket, Globe, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 pb-safe z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-pilot-blue' : 'text-text-secondary'}`}>
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">Home</span>
            </Link>

            <Link href="/bookings" className={`flex flex-col items-center gap-1 ${isActive('/bookings') ? 'text-pilot-blue' : 'text-text-secondary'}`}>
                <Ticket className="w-6 h-6" />
                <span className="text-[10px] font-medium">Bookings</span>
            </Link>

            <Link href="/explore" className={`flex flex-col items-center gap-1 ${isActive('/explore') ? 'text-pilot-blue' : 'text-text-secondary'}`}>
                <Globe className="w-6 h-6" />
                <span className="text-[10px] font-medium">Explore</span>
            </Link>

            <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-pilot-blue' : 'text-text-secondary'}`}>
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium">Profile</span>
            </Link>
        </div>
    );
}
