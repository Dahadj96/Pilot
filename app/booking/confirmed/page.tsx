'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Plane, Calendar, CreditCard, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function BookingConfirmedPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const pnr = searchParams.get('pnr');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const price = searchParams.get('price');

    return (
        <main className="min-h-screen bg-surface py-20 px-4">
            <div className="max-w-xl mx-auto text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 animate-in zoom-in-95 duration-500">
                    <CheckCircle2 className="w-14 h-14" />
                </div>

                <h1 className="text-4xl font-bold text-text-primary mb-4">Booking Confirmed!</h1>
                <p className="text-xl text-text-secondary mb-12">Your flight has been successfully booked with Amadeus. Your PNR reference is below.</p>

                {/* PNR Card */}
                <div className="bg-pilot-blue rounded-3xl p-10 text-white shadow-2xl shadow-pilot-blue/30 mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Plane className="w-32 h-32" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-3 block">PNR Reference</span>
                    <div className="text-6xl font-black font-mono tracking-tighter mb-4">{pnr || 'ABCDEF'}</div>
                    <div className="h-px bg-white/20 w-full mb-6" />
                    <div className="flex items-center justify-between text-left">
                        <div>
                            <div className="text-xs uppercase opacity-60 mb-1">Flight</div>
                            <div className="font-bold flex items-center gap-2">
                                {origin} <ArrowRight className="w-3 h-3" /> {destination}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs uppercase opacity-60 mb-1">Departure</div>
                            <div className="font-bold">{date ? new Date(date).toLocaleDateString() : '--'}</div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                        <Calendar className="w-5 h-5 text-pilot-blue mb-3" />
                        <div className="text-xs text-text-secondary mb-1 uppercase font-semibold">Travel Date</div>
                        <div className="font-bold text-text-primary">{date ? new Date(date).toLocaleDateString() : '--'}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                        <CreditCard className="w-5 h-5 text-pilot-blue mb-3" />
                        <div className="text-xs text-text-secondary mb-1 uppercase font-semibold">Amount Paid</div>
                        <div className="font-bold text-text-primary">{price ? decodeURIComponent(price) : '--'}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="btn-pilot w-full sm:w-auto px-10 py-4 flex items-center justify-center gap-2">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="btn-pilot-outline w-full sm:w-auto px-10 py-4"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </main>
    );
}
