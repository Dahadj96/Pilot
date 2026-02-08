'use client';

interface Traveler {
    id: string;
    dateOfBirth: string;
    name: {
        firstName: string;
        lastName: string;
    };
    gender: 'MALE' | 'FEMALE';
    contact: {
        emailAddress: string;
        phones: Array<{
            deviceType: 'MOBILE';
            countryCallingCode: string;
            number: string;
        }>;
    };
}

interface TravelerFormProps {
    index: number;
    onChange: (traveler: Traveler) => void;
}

export function TravelerForm({ index, onChange }: TravelerFormProps) {
    const handleChange = (field: string, value: any) => {
        // Basic implementation for now - just captures first/last name
        // In a real app, we'd have a full controlled form
        const traveler: Traveler = {
            id: (index + 1).toString(),
            dateOfBirth: '1990-01-01', // Placeholder
            gender: 'MALE', // Placeholder
            name: {
                firstName: field === 'firstName' ? value : '',
                lastName: field === 'lastName' ? value : '',
            },
            contact: {
                emailAddress: 'traveler@example.com', // Placeholder
                phones: [{
                    deviceType: 'MOBILE',
                    countryCallingCode: '213',
                    number: '555123456'
                }]
            }
        };
        onChange(traveler);
    };

    return (
        <div className="bg-surface rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Traveler {index + 1} (Adult)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary uppercase">First Name</label>
                    <input
                        type="text"
                        placeholder="As shown on passport"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pilot-blue/20 focus:border-pilot-blue transition-all"
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary uppercase">Last Name</label>
                    <input
                        type="text"
                        placeholder="As shown on passport"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pilot-blue/20 focus:border-pilot-blue transition-all"
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary uppercase">Date of Birth</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pilot-blue/20 focus:border-pilot-blue transition-all text-text-primary"
                        defaultValue="1990-01-01"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary uppercase">Gender</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pilot-blue/20 focus:border-pilot-blue transition-all bg-white text-text-primary appearance-none cursor-pointer">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
