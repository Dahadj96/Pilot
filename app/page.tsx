'use client';

import { Header } from '@/components/layout/Header';
import { SearchFormSkyFlow } from '@/components/search/SearchFormSkyFlow';
import { BottomNav } from '@/components/layout/BottomNav';
import { Clock, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-transparent pb-24 md:pb-0 relative">
            {/* Background Decor - Optional for visual punch */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

            <Header />

            <section className="px-6 pt-4 pb-12 md:pb-20">
                <SearchFormSkyFlow />
            </section>

            {/* Recent Searches - SkyFlow Style */}
            <section className="px-6 mb-10 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Recent Searches</h2>
                    <button className="text-sm font-semibold text-pilot-blue hover:underline">Clear All</button>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                    {[
                        { from: 'SFO', to: 'LHR', date: 'Oct 24 - Oct 31', pax: '1 Passenger' },
                        { from: 'SFO', to: 'HND', date: 'Dec 12 - Dec 28', pax: '2 Adults' },
                    ].map((search, i) => (
                        <div key={i} className="min-w-[280px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-pilot-blue shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 font-bold text-text-primary">
                                    <span>{search.from}</span>
                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                    <span>{search.to}</span>
                                </div>
                                <span className="text-xs text-text-secondary mt-0.5">{search.date} • {search.pax}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Destinations - SkyFlow Style */}
            <section className="px-6 mb-12 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Popular Destinations</h2>
                    <button className="text-sm font-semibold text-pilot-blue hover:underline">See All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tokyo Card */}
                    <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all">
                        <div className="h-40 rounded-2xl bg-gray-200 overflow-hidden relative mb-3">
                            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop" alt="Tokyo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="px-2 pb-2 flex justify-between items-end">
                            <div>
                                <h3 className="font-bold text-lg text-text-primary">Tokyo, Japan</h3>
                                <span className="text-xs text-text-secondary">From</span>
                            </div>
                            <span className="font-bold text-pilot-blue text-lg">$840</span>
                        </div>
                    </div>

                    {/* Paris Card */}
                    <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all">
                        <div className="h-40 rounded-2xl bg-gray-200 overflow-hidden relative mb-3">
                            <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop" alt="Paris" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="px-2 pb-2 flex justify-between items-end">
                            <div>
                                <h3 className="font-bold text-lg text-text-primary">Paris, France</h3>
                                <span className="text-xs text-text-secondary">From</span>
                            </div>
                            <span className="font-bold text-pilot-blue text-lg">$450</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Nav (Mobile Only) */}
            <BottomNav />
        </main>
    );
}
