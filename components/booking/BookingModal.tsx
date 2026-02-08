'use client';

import { useState } from 'react';
import { X, Plane, ShieldCheck, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { TravelerForm } from './TravelerForm';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    flightOffer: any;
}

export function BookingModal({ isOpen, onClose, flightOffer }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [pnr, setPnr] = useState<string | null>(null);
    const [travelers, setTravelers] = useState<any[]>([]);

    if (!isOpen) return null;

    const handleTravelerChange = (index: number, data: any) => {
        const newTravelers = [...travelers];
        newTravelers[index] = data;
        setTravelers(newTravelers);
    };

    const confirmPrice = async () => {
        setIsBooking(true);
        try {
            const response = await fetch('/api/flights/confirm-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flightOffer })
            });

            if (!response.ok) throw new Error('Failed to verify current price');

            setStep(2);
        } catch (error) {
            console.error('Price confirmation error:', error);
            alert('This flight offer is no longer available at this price. Please search again.');
            onClose();
        } finally {
            setIsBooking(false);
        }
    };

    const handleBook = async () => {
        setIsBooking(true);
        try {
            // In a real app, we'd validate traveler data here
            const response = await fetch('/api/flights/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    flightOffer, travelers: travelers.length > 0 ? travelers : [{
                        id: '1',
                        dateOfBirth: '1990-01-01',
                        gender: 'MALE',
                        name: { firstName: 'JOHN', lastName: 'DOE' },
                        contact: {
                            emailAddress: 'john.doe@example.com',
                            phones: [{ deviceType: 'MOBILE', countryCallingCode: '213', number: '555123456' }]
                        }
                    }]
                })
            });

            if (!response.ok) throw new Error('Booking failed');

            const data = await response.json();
            setPnr(data.pnr);

            // Redirect to confirmation page with details
            const params = new URLSearchParams({
                pnr: data.pnr,
                origin: flightOffer.itineraries[0].segments[0].departure.iataCode,
                destination: flightOffer.itineraries[0].segments[flightOffer.itineraries[0].segments.length - 1].arrival.iataCode,
                date: flightOffer.itineraries[0].segments[0].departure.at,
                price: flightOffer.price.formattedDZD || flightOffer.price.total
            });

            window.location.href = `/booking/confirmed?${params.toString()}`;
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pilot-blue">
                        <Plane className="w-5 h-5 fill-current rotate-45" />
                        <span className="font-bold text-lg">Pilot Booking</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                {/* Progress Indicators */}
                {step < 3 && (
                    <div className="px-6 py-4 bg-surface flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                        <div className={`flex items-center gap-2 ${step === 1 ? 'text-pilot-blue' : 'text-text-secondary'}`}>
                            <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${step === 1 ? 'border-pilot-blue bg-pilot-blue text-white' : 'border-gray-300'}`}>1</span>
                            Price Review
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <div className={`flex items-center gap-2 ${step === 2 ? 'text-pilot-blue' : 'text-text-secondary'}`}>
                            <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${step === 2 ? 'border-pilot-blue bg-pilot-blue text-white' : 'border-gray-300'}`}>2</span>
                            Travelers
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                <h2 className="text-xl font-bold text-text-primary mb-2">Final Price Review</h2>
                                <p className="text-text-secondary text-sm mb-4">We're verifying the latest pricing and availability with the airline. This takes just a moment.</p>
                                <div className="flex items-center justify-between py-4 border-t border-blue-100">
                                    <span className="text-text-primary font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold text-pilot-blue">{flightOffer.price.formattedDZD}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-text-primary">Secured Booking</h4>
                                        <p className="text-xs text-text-secondary">Your data is protected by industry-standard encryption.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-text-primary">Instant Confirmation</h4>
                                        <p className="text-xs text-text-secondary">Get your PNR reference immediately after booking.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">Traveler Information</h2>
                                <p className="text-text-secondary text-sm">Please enter traveler names exactly as they appear on passports or government IDs.</p>
                            </div>

                            <TravelerForm
                                index={0}
                                onChange={(data) => handleTravelerChange(0, data)}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-bold text-text-primary mb-2">Booking Confirmed!</h2>
                            <p className="text-text-secondary mb-8">Your flight has been successfully booked. Have a great trip!</p>

                            <div className="max-w-xs mx-auto bg-pilot-blue rounded-3xl p-8 text-white shadow-xl shadow-pilot-blue/20">
                                <span className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2 block">Your PNR Reference</span>
                                <div className="text-4xl font-black font-mono tracking-tighter">{pnr}</div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-10 text-pilot-blue font-semibold hover:underline"
                            >
                                Back to Results
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step < 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="text-text-secondary text-sm font-medium hover:text-text-primary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={step === 1 ? confirmPrice : handleBook}
                            disabled={isBooking}
                            className="bg-pilot-blue hover:bg-pilot-blue-dark text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isBooking ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {step === 1 ? 'Verify Price & Continue' : 'Confirm Flight Booking'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
