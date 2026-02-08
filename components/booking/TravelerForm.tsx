import { User, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import { useState, useImperativeHandle, forwardRef } from 'react';

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
    // Initial data to populate form if available
    initialData?: Partial<Traveler>;
}

export interface TravelerFormRef {
    validate: () => boolean;
}

export const TravelerForm = forwardRef<TravelerFormRef, TravelerFormProps>(({ index, onChange, initialData }, ref) => {
    // Local state for immediate feedback, though we lift state up via onChange
    const [formData, setFormData] = useState({
        firstName: initialData?.name?.firstName || '',
        lastName: initialData?.name?.lastName || '',
        dateOfBirth: initialData?.dateOfBirth || '',
        gender: initialData?.gender || 'MALE',
        email: initialData?.contact?.emailAddress || '',
        phone: initialData?.contact?.phones?.[0]?.number || '',
        countryCode: initialData?.contact?.phones?.[0]?.countryCallingCode || '213'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Expose validate method to parent
    useImperativeHandle(ref, () => ({
        validate: () => {
            const newErrors: Record<string, string> = {};
            let isValid = true;

            if (!formData.firstName.trim()) {
                newErrors.firstName = 'First name is required';
                isValid = false;
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
                isValid = false;
            }
            if (!formData.dateOfBirth) {
                newErrors.dateOfBirth = 'Date of birth is required';
                isValid = false;
            }
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Invalid email format';
                isValid = false;
            }
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
                isValid = false;
            } else if (!/^\d+$/.test(formData.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Phone number must contain only digits';
                isValid = false;
            }

            setErrors(newErrors);
            return isValid;
        }
    }));

    const handleChange = (field: string, value: string) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Construct the Traveler object to send back to parent
        const travelerData: any = {
            id: (index + 1).toString(),
            dateOfBirth: newData.dateOfBirth || '1990-01-01', // Fallback to avoid breaking API if incomplete
            gender: newData.gender as 'MALE' | 'FEMALE',
            name: {
                firstName: newData.firstName,
                lastName: newData.lastName
            },
            contact: {
                emailAddress: newData.email,
                phones: [{
                    deviceType: 'MOBILE',
                    countryCallingCode: newData.countryCode,
                    number: newData.phone
                }]
            }
        };

        onChange(travelerData);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pilot-blue/10 flex items-center justify-center text-pilot-blue font-bold">
                    {index + 1}
                </div>
                <h3 className="text-lg font-bold text-text-primary">Adult Traveler</h3>
            </div>

            <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group relative">
                        <div className={`absolute top-3 left-4 transition-colors ${errors.firstName ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pilot-blue'}`}>
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="First Name (as on passport)"
                            value={formData.firstName}
                            className={`input-pilot pl-12 w-full bg-gray-50/50 focus:bg-white transition-colors ${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                        {errors.firstName && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 pl-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.firstName}</span>
                            </div>
                        )}
                    </div>
                    <div className="group relative">
                        <div className={`absolute top-3 left-4 transition-colors ${errors.lastName ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pilot-blue'}`}>
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            className={`input-pilot pl-12 w-full bg-gray-50/50 focus:bg-white transition-colors ${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                        {errors.lastName && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 pl-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.lastName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group relative">
                        <div className={`absolute top-3 left-4 transition-colors ${errors.dateOfBirth ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pilot-blue'}`}>
                            <Calendar className="w-5 h-5" />
                        </div>
                        <input
                            type="date"
                            value={formData.dateOfBirth}
                            className={`input-pilot pl-12 w-full bg-gray-50/50 focus:bg-white transition-colors text-text-primary ${errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : ''}`}
                            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        />
                        {errors.dateOfBirth && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 pl-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.dateOfBirth}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex bg-gray-50 rounded-xl p-1.5 gap-2">
                        <button
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${formData.gender === 'MALE' ? 'bg-white text-pilot-blue shadow-sm' : 'text-text-secondary hover:bg-white/50'}`}
                            onClick={() => handleChange('gender', 'MALE')}
                        >
                            Male
                        </button>
                        <button
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${formData.gender === 'FEMALE' ? 'bg-white text-pilot-blue shadow-sm' : 'text-text-secondary hover:bg-white/50'}`}
                            onClick={() => handleChange('gender', 'FEMALE')}
                        >
                            Female
                        </button>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Contact Details</h4>

                    <div className="group relative">
                        <div className={`absolute top-3 left-4 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pilot-blue'}`}>
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            className={`input-pilot pl-12 w-full bg-gray-50/50 focus:bg-white transition-colors ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 pl-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="group relative">
                        <div className={`absolute top-3 left-4 transition-colors ${errors.phone ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pilot-blue'}`}>
                            <Phone className="w-5 h-5" />
                        </div>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            className={`input-pilot pl-12 w-full bg-gray-50/50 focus:bg-white transition-colors ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                        {errors.phone && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 pl-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

TravelerForm.displayName = 'TravelerForm';
