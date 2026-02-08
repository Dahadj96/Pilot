# Pilot - Project Folder Structure

## Current Structure (Phase 0 Complete)

```
pilot/
├── .env.local                    # ✅ Preserved - API credentials
│   ├── AMADEUS_API_KEY
│   ├── AMADEUS_API_SECRET
│   ├── AMADEUS_BASE_URL
│   ├── NEXT_PUBLIC_SUPABASE_URL
│   └── NEXT_PUBLIC_SUPABASE_ANON_KEY
│
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git exclusions
├── README.md                    # Project documentation
├── package.json                 # Dependencies (367 packages)
├── package-lock.json            # Locked dependency versions
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # ✅ Pilot design tokens
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS for Tailwind
├── next-env.d.ts                # Next.js TypeScript definitions
│
├── .next/                       # Build output (auto-generated)
├── node_modules/                # Dependencies (367 packages)
│
└── app/                         # ✅ Next.js App Router
    ├── globals.css              # ✅ Pilot design system
    ├── layout.tsx               # ✅ Root layout with Geist font
    └── page.tsx                 # ✅ Homepage with hero section
```

---

## Planned Structure (Phases 1-5)

```
pilot/
├── app/
│   ├── globals.css              # ✅ DONE
│   ├── layout.tsx               # ✅ DONE
│   ├── page.tsx                 # ✅ DONE
│   │
│   ├── api/                     # 🔄 Phase 1: Backend routes
│   │   ├── airports/
│   │   │   └── search/
│   │   │       └── route.ts     # Airport autocomplete endpoint
│   │   └── flights/
│   │       └── search/
│   │           └── route.ts     # Amadeus flight search proxy
│   │
│   └── search/                  # 🔄 Phase 4: Results page
│       └── page.tsx             # Flight results with filters
│
├── components/                  # 🔄 Phase 2-4: UI components
│   ├── layout/
│   │   └── Header.tsx           # Navigation with language switcher
│   │
│   ├── search/                  # 🔄 Phase 3: Search interface
│   │   ├── SearchForm.tsx       # Main search card
│   │   ├── AirportAutocomplete.tsx  # Debounced airport input
│   │   ├── DatePicker.tsx       # Date selection
│   │   └── PassengerSelector.tsx    # Passenger count
│   │
│   ├── flights/                 # 🔄 Phase 4: Results display
│   │   ├── FlightCard.tsx       # Individual flight result
│   │   ├── FlightSkeleton.tsx   # Loading placeholder
│   │   └── FlightFilters.tsx    # Price/airline filters
│   │
│   └── ui/                      # 🔄 Phase 2: Base components
│       ├── Button.tsx           # Reusable button
│       ├── Card.tsx             # Bento-style card
│       ├── Input.tsx            # Form input
│       └── Skeleton.tsx         # Loading skeleton
│
├── lib/                         # 🔄 Phase 1: Utilities & clients
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   └── server.ts            # Server Supabase client
│   │
│   ├── amadeus/
│   │   └── client.ts            # Amadeus API wrapper
│   │
│   └── i18n/                    # 🔄 Phase 5: Internationalization
│       └── translations.ts      # AR/FR/EN strings
│
├── public/                      # 🔄 Phase 1: Static assets
│   └── data/
│       └── airports.json        # Indexed OurAirports data
│
└── middleware.ts                # 🔄 Phase 5: i18n routing
```

---

## File Count Summary

### Current (Phase 0 Complete)
- **Configuration Files**: 7
- **App Files**: 3 (globals.css, layout.tsx, page.tsx)
- **Total Source Files**: 10
- **Dependencies**: 367 packages

### Planned (All Phases)
- **API Routes**: 2
- **Components**: ~15
- **Lib Files**: ~5
- **Total Estimated**: ~35 source files

---

## Key Directories Explained

### `/app`
Next.js 14 App Router directory. Contains pages, layouts, and API routes.

### `/components`
Reusable React components organized by feature:
- `layout/` - Navigation, header, footer
- `search/` - Search form and inputs
- `flights/` - Flight results display
- `ui/` - Base design system components

### `/lib`
Utility functions and API clients:
- `supabase/` - Database and auth clients
- `amadeus/` - Flight API integration
- `i18n/` - Translation utilities

### `/public`
Static assets served directly:
- `data/` - Processed airport data for fast autocomplete

---

## Design System Files

### `tailwind.config.ts`
Pilot design tokens:
- Colors (Pilot Blue #0052FF)
- Border radius (rounded-3xl)
- Shadows (pilot-sm/md/lg)
- Typography (Geist Sans)

### `app/globals.css`
Component classes:
- `.btn-pilot` - Primary buttons
- `.glass-card` - Glassmorphic cards
- `.input-pilot` - Form inputs
- `.card-pilot` - Content cards

---

## Status Legend
- ✅ **DONE** - Implemented and verified
- 🔄 **PLANNED** - Documented in implementation plan
- ⏳ **IN PROGRESS** - Currently being built

---

**Current Phase**: Phase 0 Complete ✅  
**Next Phase**: Phase 1 - Core Foundation (Supabase + APIs)
