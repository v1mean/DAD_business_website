# DAD Electronics — QR Product Catalog

A bilingual (Khmer/English) product catalog website for an electronics business. Customers scan QR codes on physical products to view detailed product information online.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Base UI)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- [npm](https://www.npmjs.com/) 9 or later
- A [Supabase](https://supabase.com/) project (free tier works for development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd DAD_Business
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and fill in your Supabase project credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key (**keep secret**)
   - `NEXT_PUBLIC_SITE_URL` — Your site URL (use `http://localhost:3000` for development)
   - `NEXT_PUBLIC_TELEGRAM_USERNAME` — Your business Telegram username
   - `NEXT_PUBLIC_CURRENCY` — Default currency code (e.g., `USD`)

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public customer-facing routes
│   │   ├── layout.tsx          # Public layout (header, footer)
│   │   ├── page.tsx            # Homepage
│   │   └── products/
│   │       ├── page.tsx        # Product catalog
│   │       └── [slug]/
│   │           └── page.tsx    # Product detail (QR destination)
│   ├── (admin)/                # Protected admin routes
│   │   ├── layout.tsx          # Admin layout (sidebar)
│   │   └── admin/
│   │       ├── page.tsx        # Dashboard overview
│   │       ├── login/
│   │       │   └── page.tsx    # Admin login
│   │       └── products/
│   │           └── page.tsx    # Product management
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles + Tailwind + shadcn theme
├── components/
│   └── ui/                     # shadcn/ui components
│       └── button.tsx
├── lib/
│   ├── constants.ts            # App-wide constants and type aliases
│   ├── utils.ts                # Utility functions (cn helper)
│   └── supabase/
│       ├── client.ts           # Browser Supabase client (Phase 3)
│       └── server.ts           # Server Supabase client (Phase 3)
└── types/
    ├── index.ts                # Barrel export
    └── database.ts             # TypeScript types for DB entities
```

## Development Roadmap

- [x] **Phase 1:** Project Setup
- [x] **Phase 2:** UI Foundation (design system, navigation, i18n)
- [x] **Phase 3:** Database & Security (Supabase, migrations, RLS)
- [x] **Phase 4:** Product Management (admin CRUD, bilingual form, specs builder)
- [x] **Phase 5:** Public Catalog (live data hydration, instant search, category & brand filters, Price Privacy Guard)
- [x] **Phase 6:** QR Code Integration (high-res vector SVG & 1024px PNG download, printable showroom label cards, batch printing)
- [x] **Phase 7:** QA & Launch (photo uploads, mobile QR sticky bar, SEO sitemaps, production build verified)

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

> **⚠️ Important:** Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## License

Private — All rights reserved.
