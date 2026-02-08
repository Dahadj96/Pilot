import { SearchFormGoogleStyle } from "@/components/search/SearchFormGoogleStyle";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-surface via-white to-surface">
            {/* Header */}
            <header className="px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pilot-blue rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-2xl font-bold text-text-primary">Pilot</span>
                    </div>

                    <nav className="flex items-center gap-6">
                        <button className="text-text-secondary hover:text-text-primary transition-colors">
                            Flights
                        </button>
                        <button className="text-text-secondary hover:text-text-primary transition-colors">
                            My Trips
                        </button>
                        <button className="btn-pilot-outline text-sm">
                            Sign In
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-6xl font-bold text-text-primary mb-4">
                            Find Your Perfect Flight
                        </h1>
                        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                            Search flights across Algeria and the world. Compare prices in DZD and book with confidence.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="max-w-6xl mx-auto animate-slide-up">
                        <SearchFormGoogleStyle />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card-pilot p-6">
                            <div className="w-12 h-12 bg-pilot-blue/10 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pilot-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Global Coverage</h3>
                            <p className="text-text-secondary">Search flights from Algeria to anywhere in the world with comprehensive IATA data.</p>
                        </div>

                        <div className="card-pilot p-6">
                            <div className="w-12 h-12 bg-pilot-blue/10 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pilot-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">DZD Pricing</h3>
                            <p className="text-text-secondary">All prices displayed in Algerian Dinar for transparent, local pricing.</p>
                        </div>

                        <div className="card-pilot p-6">
                            <div className="w-12 h-12 bg-pilot-blue/10 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pilot-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Live Results</h3>
                            <p className="text-text-secondary">Real-time flight availability and pricing powered by Amadeus API.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
