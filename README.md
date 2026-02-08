# Pilot ✈️

A modern flight booking search engine for the Algerian market, featuring real-time pricing in DZD and global airport coverage.

## Features

- 🌍 **Global Coverage** - Search flights from Algeria to anywhere using comprehensive IATA data
- 💰 **DZD Pricing** - All prices displayed in Algerian Dinar
- ⚡ **Live Results** - Real-time flight availability powered by Amadeus API
- 🎨 **Modern UI** - Glassmorphic design with smooth animations
- 🌐 **Multi-language** - Support for Arabic (RTL), French, and English

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom Pilot design system
- **Backend**: Supabase (Auth & Database)
- **APIs**: Amadeus Self-Service + OurAirports Dataset
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Geist Sans

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```env
   # Amadeus API
   AMADEUS_API_KEY=your_key
   AMADEUS_API_SECRET=your_secret
   AMADEUS_BASE_URL=https://test.api.amadeus.com

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pilot/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities & clients
└── public/               # Static assets
```

## Design System

- **Primary Color**: Pilot Blue (#0052FF)
- **Border Radius**: rounded-3xl (24px)
- **Shadows**: Soft elevation (pilot-sm, pilot-md, pilot-lg)
- **Effects**: Glassmorphism with backdrop-blur

## License

Private - All rights reserved
