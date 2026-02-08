'use client';

import { motion } from 'framer-motion';

export function FlightSkeleton() {
    return (
        <div className="relative overflow-hidden bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/40 p-6 shadow-sm mb-4">
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"
            />

            <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                {/* Airline & Times */}
                <div className="flex flex-1 items-center gap-6">
                    <div className="w-12 h-12 bg-gray-200/50 rounded-2xl shrink-0" />

                    <div className="flex flex-1 items-center justify-between max-w-md">
                        <div className="space-y-2">
                            <div className="h-6 w-16 bg-gray-200/50 rounded-lg" />
                            <div className="h-4 w-12 bg-gray-200/50 rounded-lg opacity-50" />
                        </div>

                        <div className="flex-1 mx-8 relative">
                            <div className="h-0.5 w-full bg-gray-200/30" />
                            <div className="h-4 w-20 bg-gray-200/50 rounded-full mx-auto mt-2" />
                        </div>

                        <div className="space-y-2 text-right">
                            <div className="h-6 w-16 bg-gray-200/50 rounded-lg" />
                            <div className="h-4 w-12 bg-gray-200/50 rounded-lg opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Pricing & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <div className="h-8 w-24 bg-pilot-blue/10 rounded-xl" />
                    <div className="h-10 w-32 bg-pilot-blue/20 rounded-full" />
                </div>
            </div>
        </div>
    );
}
