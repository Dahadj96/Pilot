'use client';

import { Plane, Clock, ChevronDown, ChevronUp, Luggage, Info, X } from 'lucide-react';
import { useState } from 'react';
import { getAirlineLogoWithCache } from '@/lib/services/airlineLogos';
import Image from 'next/image';
import { BookingModal } from '../booking/BookingModal';

interface FlightSegment {
    departure: {
        iataCode: string;
        at: string;
    };
    arrival: {
        iataCode: string;
        at: string;
    };
    duration: string;
    carrierCode: string;
    number?: string;
    aircraft?: {
        code: string;
    };
    operating?: {
        carrierCode: string;
    };
}

interface FlightOffer {
    id: string;
    price: {
        totalDZD: number;
        formattedDZD: string;
    };
    itineraries: Array<{
        segments: FlightSegment[];
        duration: string;
    }>;
    validatingAirlineCodes: string[];
    numberOfBookableSeats?: number;
    travelerPricings?: Array<{
        fareDetailsBySegment: Array<{
            cabin?: string;
            includedCheckedBags?: {
                quantity?: number;
            };
        }>;
    }>;
}

interface FlightCardProps {
    offer: FlightOffer;
    dictionaries?: {
        carriers?: Record<string, string>;
        aircraft?: Record<string, string>;
    };
}

export function FlightCard({ offer, dictionaries }: FlightCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [seatAvailability, setSeatAvailability] = useState<any>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const firstItinerary = offer.itineraries[0];
    const firstSegment = firstItinerary.segments[0];
    const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

    const carrierCode = offer.validatingAirlineCodes[0] || firstSegment.carrierCode;
    const carrierName = dictionaries?.carriers?.[carrierCode] || carrierCode;

    const stops = firstItinerary.segments.length - 1;

    // Get cabin class from first segment
    const cabinClass = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY';

    // Get baggage allowance
    const checkedBags = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity || 0;

    // Get airline logo URL
    const logoUrl = getAirlineLogoWithCache(carrierCode);

    // Format time from ISO string
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Format duration from ISO 8601 duration
    const formatDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?/);
        if (!match) return duration;

        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;

        return `${hours}h ${minutes}m`;
    };

    // Calculate layover duration
    const getLayoverDuration = (segment1: FlightSegment, segment2: FlightSegment) => {
        const arrival = new Date(segment1.arrival.at);
        const departure = new Date(segment2.departure.at);
        const diff = departure.getTime() - arrival.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // Get cabin class badge color
    const getCabinBadgeColor = (cabin: string) => {
        switch (cabin.toUpperCase()) {
            case 'FIRST':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'BUSINESS':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'PREMIUM_ECONOMY':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Format cabin class name
    const formatCabinClass = (cabin: string) => {
        return cabin.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    // Show seat availability info
    const showSeatInfo = () => {
        setSeatAvailability({
            total: offer.numberOfBookableSeats || 0,
            cabin: cabinClass
        });
    };

    return (
        <div className="card-pilot p-6 hover:shadow-pilot-lg transition-all duration-200">
            {/* Urgency Badge for Limited Seats */}
            {offer.numberOfBookableSeats && offer.numberOfBookableSeats < 5 && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
                    <span className="text-red-600 font-semibold text-sm">
                        ⚠️ Only {offer.numberOfBookableSeats} seat{offer.numberOfBookableSeats > 1 ? 's' : ''} left at this price!
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between gap-6">
                {/* Airline Info with Logo */}
                <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={carrierName}
                                className="w-10 h-10 object-contain"
                                onError={(e) => {
                                    // Fallback to plane icon if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <Plane className={`w-6 h-6 text-pilot-blue ${logoUrl ? 'hidden' : ''}`} />
                    </div>
                    <div>
                        <div className="font-semibold text-text-primary">{carrierName}</div>
                        <div className="text-xs text-text-secondary font-mono">
                            {firstSegment.number || carrierCode}
                        </div>
                    </div>
                </div>

                {/* Flight Timeline */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        {/* Departure */}
                        <div className="text-center">
                            <div className="text-2xl font-bold text-text-primary">
                                {formatTime(firstSegment.departure.at)}
                            </div>
                            <div className="text-sm text-text-secondary mt-1">
                                {firstSegment.departure.iataCode}
                            </div>
                        </div>

                        {/* Duration & Stops */}
                        <div className="flex-1 mx-6">
                            <div className="relative">
                                <div className="h-0.5 bg-pilot-blue/20 w-full" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3">
                                    <div className="flex items-center gap-2 text-xs text-text-secondary whitespace-nowrap">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(firstItinerary.duration)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-xs text-text-secondary">
                                    {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                                </span>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <div className="text-2xl font-bold text-text-primary">
                                {formatTime(lastSegment.arrival.at)}
                            </div>
                            <div className="text-sm text-text-secondary mt-1">
                                {lastSegment.arrival.iataCode}
                            </div>
                        </div>
                    </div>

                    {/* Cabin Class & Baggage Badges */}
                    <div className="flex items-center gap-2 mt-3 justify-center">
                        <span className={`text-xs px-3 py-1 rounded-full border ${getCabinBadgeColor(cabinClass)}`}>
                            {formatCabinClass(cabinClass)}
                        </span>
                        {checkedBags > 0 && (
                            <span className="text-xs px-3 py-1 rounded-full border bg-green-50 text-green-800 border-green-200 flex items-center gap-1">
                                <Luggage className="w-3 h-3" />
                                {checkedBags} bag{checkedBags > 1 ? 's' : ''}
                            </span>
                        )}
                        {offer.numberOfBookableSeats && offer.numberOfBookableSeats < 9 && (
                            <span className="text-xs px-3 py-1 rounded-full border bg-orange-50 text-orange-800 border-orange-200">
                                {offer.numberOfBookableSeats} seats left
                            </span>
                        )}
                    </div>
                </div>

                {/* Price & Select */}
                <div className="text-right min-w-[200px]">
                    <div className="text-3xl font-bold text-pilot-blue mb-3">
                        {offer.price.formattedDZD}
                    </div>
                    <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="btn-pilot text-sm px-6 py-2 w-full mb-2"
                    >
                        Select Flight
                    </button>
                    {offer.numberOfBookableSeats && (
                        <button
                            onClick={showSeatInfo}
                            disabled={seatAvailability !== null}
                            className="text-xs px-4 py-2 rounded-lg border border-pilot-blue text-pilot-blue hover:bg-pilot-blue/5 disabled:opacity-50 disabled:cursor-not-allowed w-full mb-2 transition-colors"
                        >
                            {seatAvailability ? 'Seat Info Shown ✓' : 'View Seat Information'}
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-pilot-blue hover:underline flex items-center gap-1 mx-auto"
                    >
                        {isExpanded ? (
                            <>Hide details <ChevronUp className="w-3 h-3" /></>
                        ) : (
                            <>View details <ChevronDown className="w-3 h-3" /></>
                        )}
                    </button>
                </div>
            </div>

            {/* Booking Modal Integration */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                flightOffer={offer}
            />

            {/* Seat Availability Display */}
            {seatAvailability && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm font-semibold text-text-primary mb-3">Seat Information</div>
                    <div className="bg-surface rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-text-secondary mb-1">Available Seats</div>
                                <div className="text-3xl font-bold text-pilot-blue">
                                    {seatAvailability.total}
                                </div>
                                <div className="text-xs text-text-secondary mt-1">
                                    in {formatCabinClass(seatAvailability.cabin)}
                                </div>
                            </div>
                            <div className="text-right">
                                {seatAvailability.total < 9 ? (
                                    <div className="text-orange-600 text-sm font-medium">
                                        ⚠️ Limited availability
                                    </div>
                                ) : (
                                    <div className="text-green-600 text-sm font-medium">
                                        ✓ Good availability
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Expandable Details */}
            {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="text-sm font-semibold text-text-primary mb-3">Flight Details</div>

                    {firstItinerary.segments.map((segment, index) => (
                        <div key={index}>
                            {/* Segment Details */}
                            <div className="bg-surface rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                                {logoUrl ? (
                                                    <img
                                                        src={getAirlineLogoWithCache(segment.carrierCode)}
                                                        alt={segment.carrierCode}
                                                        className="w-6 h-6 object-contain"
                                                    />
                                                ) : (
                                                    <Plane className="w-4 h-4 text-pilot-blue" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-text-primary">
                                                    {dictionaries?.carriers?.[segment.carrierCode] || segment.carrierCode}
                                                </div>
                                                <div className="text-xs text-text-secondary font-mono">
                                                    Flight {segment.number || segment.carrierCode}
                                                    {segment.aircraft?.code && ` • ${segment.aircraft.code}`}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-text-secondary mb-1">Departure</div>
                                                <div className="text-lg font-bold text-text-primary">
                                                    {formatTime(segment.departure.at)}
                                                </div>
                                                <div className="text-sm text-text-secondary">
                                                    {segment.departure.iataCode}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-text-secondary mb-1">Arrival</div>
                                                <div className="text-lg font-bold text-text-primary">
                                                    {formatTime(segment.arrival.at)}
                                                </div>
                                                <div className="text-sm text-text-secondary">
                                                    {segment.arrival.iataCode}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-xs text-text-secondary">
                                            Duration: {formatDuration(segment.duration)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Layover Info */}
                            {index < firstItinerary.segments.length - 1 && (
                                <div className="flex items-center gap-2 py-3 px-4 text-xs text-text-secondary">
                                    <Info className="w-4 h-4" />
                                    <span>
                                        Layover in {segment.arrival.iataCode} • {getLayoverDuration(segment, firstItinerary.segments[index + 1])}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
