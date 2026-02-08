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

    // Mock badges for SkyFlow demo (would be calculated in real app)
    const isCheapest = offer.price.totalDZD < 50000;
    const isFastest = parseInt(firstItinerary.duration.replace(/\D/g, '')) < 400; // Mock logic

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">

            {/* SkyFlow Badges */}
            <div className="absolute top-0 right-0 p-0">
                {(isCheapest || isFastest) && (
                    <div className={`px-3 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider ${isCheapest ? 'bg-green-400 text-white' : 'bg-pilot-blue text-white'}`}>
                        {isCheapest ? 'Best Price' : 'Fastest'}
                    </div>
                )}
            </div>

            {/* Urgency Badge */}
            {offer.numberOfBookableSeats && offer.numberOfBookableSeats < 5 && (
                <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-red-600 font-bold text-[10px] uppercase tracking-wide">
                        Only {offer.numberOfBookableSeats} Left
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {/* Main Flight Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Airline & Route Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shrink-0">
                            {logoUrl ? (
                                <img src={logoUrl} alt={carrierName} className="w-6 h-6 object-contain" />
                            ) : (
                                <Plane className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-text-primary text-base leading-tight">{carrierName}</h3>
                            <span className="text-xs text-text-secondary">{firstSegment.number} • {formatCabinClass(cabinClass)}</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 w-full md:px-8">
                        <div className="flex items-center justify-between text-text-primary">
                            <div className="text-left">
                                <div className="text-xl font-bold">{formatTime(firstSegment.departure.at)}</div>
                                <div className="text-xs font-medium text-gray-400">{firstSegment.departure.iataCode}</div>
                            </div>

                            {/* Duration Graph */}
                            <div className="flex-1 px-4 flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 mb-1">{formatDuration(firstItinerary.duration)}</span>
                                <div className="w-full h-[2px] bg-gray-200 relative">
                                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    </div>
                                    {/* Plane Icon moving */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                                        <Plane className="w-3 h-3 text-gray-300 rotate-90" />
                                    </div>
                                    {/* Expanded Details - Timeline */}
                                    <div
                                        className={`
                        overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-100 bg-gray-50/50
                        ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
                    `}
                                    >
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">
                                    {stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                                </span>
                            </div>

                            <div className="text-right">
                                <div className="text-xl font-bold">{formatTime(lastSegment.arrival.at)}</div>
                                <div className="text-xs font-medium text-gray-400">{lastSegment.arrival.iataCode}</div>
                            </div>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-gray-100">
                        <div className="flex flex-col items-start md:items-end">
                            <span className="text-2xl font-bold text-pilot-blue">{offer.price.formattedDZD}</span>
                            <span className="text-[10px] text-gray-400">per traveler</span>
                        </div>

                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="bg-pilot-blue text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-pilot-blue-dark transition-colors shadow-pilot hover:shadow-pilot-lg active:scale-95 ml-4 md:ml-0 md:mt-3"
                        >
                            Select
                        </button>
                    </div>
                </div>

                {/* Footer / Expand */}
                <div className="flex items-center justify-between pt-0">
                    <div className="flex items-center gap-3">
                        {checkedBags > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                <Luggage className="w-3 h-3" />
                                <span>{checkedBags} Bag{checkedBags > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs font-semibold text-gray-400 hover:text-pilot-blue flex items-center gap-1 transition-colors"
                    >
                        {isExpanded ? 'Less details' : 'Flight details'}
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
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
