export interface Airport {
    iata: string;
    name: string;
    city: string;
    country: string;
    countryCode: string;
}

// Curated list of major airports (focusing on Algeria and popular destinations)
// In production, this would be loaded from OurAirports CSV
export const airports: Airport[] = [
    // Algeria
    { iata: 'ALG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'ORN', name: 'Ahmed Ben Bella Airport', city: 'Oran', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'CZL', name: 'Mohamed Boudiaf International Airport', city: 'Constantine', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'AAE', name: 'Rabah Bitat Airport', city: 'Annaba', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'TLM', name: 'Zenata Airport', city: 'Tlemcen', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'BJA', name: 'Soummam Airport', city: 'Bejaia', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'QSF', name: 'Ain Arnat Airport', city: 'Setif', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'AZR', name: 'Touat-Cheikh Sidi Mohamed Belkebir Airport', city: 'Adrar', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'TMR', name: 'Aguenar – Hadj Bey Akhamok Airport', city: 'Tamanrasset', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'BMW', name: 'Bordj Badji Mokhtar Airport', city: 'Bordj Badji Mokhtar', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'BSK', name: 'Biskra Airport', city: 'Biskra', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'GJL', name: 'Jijel Ferhat Abbas Airport', city: 'Jijel', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'VVZ', name: 'Illizi Takhamalt Airport', city: 'Illizi', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'HRM', name: 'Hassi R\'Mel Airport', city: 'Hassi R\'Mel', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'MZW', name: 'Mecheria Airport', city: 'Mecheria', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'ELG', name: 'El Golea Airport', city: 'El Golea', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'INZ', name: 'In Salah Airport', city: 'In Salah', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'TID', name: 'Bou Chekif Airport', city: 'Tiaret', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'GHA', name: 'Noumerate Airport', city: 'Ghardaia', country: 'Algeria', countryCode: 'DZ' },
    { iata: 'OGX', name: 'Ain el Beida Airport', city: 'Ouargla', country: 'Algeria', countryCode: 'DZ' },


    // France
    { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FR' },
    { iata: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', countryCode: 'FR' },
    { iata: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France', countryCode: 'FR' },
    { iata: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France', countryCode: 'FR' },
    { iata: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', countryCode: 'FR' },

    // UAE
    { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE' },
    { iata: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE' },

    // Turkey
    { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', countryCode: 'TR' },
    { iata: 'SAW', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey', countryCode: 'TR' },

    // Spain
    { iata: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', countryCode: 'ES' },
    { iata: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', countryCode: 'ES' },

    // UK
    { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB' },
    { iata: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB' },

    // Germany
    { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE' },
    { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', countryCode: 'DE' },

    // Italy
    { iata: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy', countryCode: 'IT' },
    { iata: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', countryCode: 'IT' },

    // USA
    { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', countryCode: 'US' },
    { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', countryCode: 'US' },
    { iata: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States', countryCode: 'US' },

    // Saudi Arabia
    { iata: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA' },
    { iata: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA' },

    // Egypt
    { iata: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', countryCode: 'EG' },

    // Morocco
    { iata: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', countryCode: 'MA' },
    { iata: 'RAK', name: 'Marrakesh Menara Airport', city: 'Marrakesh', country: 'Morocco', countryCode: 'MA' },

    // Tunisia
    { iata: 'TUN', name: 'Tunis-Carthage International Airport', city: 'Tunis', country: 'Tunisia', countryCode: 'TN' },
];
