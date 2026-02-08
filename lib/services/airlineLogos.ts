/**
 * Airline Logo Service
 * 
 * Fetches airline logos from free online sources and caches them in Supabase
 * Fallback to generic plane icon if logo not available
 */

// Airline logo sources (in order of preference)
const LOGO_SOURCES = {
    // Clearbit Logo API - free, no auth required
    clearbit: (iataCode: string) => `https://logo.clearbit.com/${getAirlineDomain(iataCode)}`,

    // AirlineLogo.com - free CDN
    airlineLogo: (iataCode: string) => `https://images.kiwi.com/airlines/64/${iataCode}.png`,

    // Alternative: Airline Codes API
    airlineCodes: (iataCode: string) => `https://content.airhex.com/content/logos/airlines_${iataCode}_50_50_s.png`,
};

// Map IATA codes to airline domains for Clearbit
function getAirlineDomain(iataCode: string): string {
    const domainMap: Record<string, string> = {
        'AH': 'airalgerie.dz',
        'AF': 'airfrance.com',
        'BA': 'britishairways.com',
        'LH': 'lufthansa.com',
        'EK': 'emirates.com',
        'QR': 'qatarairways.com',
        'TK': 'turkishairlines.com',
        'EY': 'etihad.com',
        'SV': 'saudia.com',
        'MS': 'egyptair.com',
        'AT': 'royalairmaroc.com',
        'TU': 'tunisair.com',
        // Add more as needed
    };

    return domainMap[iataCode] || `${iataCode.toLowerCase()}.com`;
}

/**
 * Get airline logo URL with fallback chain
 */
export async function getAirlineLogo(iataCode: string): Promise<string> {
    // Try each source in order
    for (const [source, getUrl] of Object.entries(LOGO_SOURCES)) {
        try {
            const url = getUrl(iataCode);

            // Check if image exists
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                return url;
            }
        } catch (error) {
            // Continue to next source
            continue;
        }
    }

    // Fallback to null (will use generic plane icon)
    return '';
}

/**
 * Get airline logo with caching
 * Returns direct URL to airline logo from Kiwi.com CDN
 */
export function getAirlineLogoWithCache(iataCode: string): string {
    // Use Kiwi.com CDN which has most airline logos
    // Fallback to common logos map if needed
    return COMMON_AIRLINE_LOGOS[iataCode] || `https://images.kiwi.com/airlines/64/${iataCode}.png`;
}

/**
 * Preload logos for common airlines
 */
export const COMMON_AIRLINE_LOGOS: Record<string, string> = {
    'AH': 'https://images.kiwi.com/airlines/64/AH.png',
    'AF': 'https://images.kiwi.com/airlines/64/AF.png',
    'BA': 'https://images.kiwi.com/airlines/64/BA.png',
    'LH': 'https://images.kiwi.com/airlines/64/LH.png',
    'EK': 'https://images.kiwi.com/airlines/64/EK.png',
    'QR': 'https://images.kiwi.com/airlines/64/QR.png',
    'TK': 'https://images.kiwi.com/airlines/64/TK.png',
    'EY': 'https://images.kiwi.com/airlines/64/EY.png',
    'SV': 'https://images.kiwi.com/airlines/64/SV.png',
    'MS': 'https://images.kiwi.com/airlines/64/MS.png',
    'AT': 'https://images.kiwi.com/airlines/64/AT.png',
    'TU': 'https://images.kiwi.com/airlines/64/TU.png',
};
