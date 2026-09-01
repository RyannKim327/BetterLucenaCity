# BetterLucenaCity

![Better Lucena City](public/better-lucena-city-banner.png)

**Transparent. Accessible. Para sa mamamayan.**

BetterLucenaCity is a community-driven platform that makes Lucena City's government information and public services more accessible, transparent, and easy to navigate.

Non-partisan. Facts-first. Built in the spirit of *bayanihan*.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Database Schema](#database-schema)
- [Supabase Configuration](#supabase-configuration)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Data Sources](#data-sources)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Services directory** — LGU services with requirements, fees, and office locations
- **Transparency dashboard** — budget and project data surfaced from public sources
- **Ordinances & legal documents** — searchable local legislation
- **Announcements** — city advisories and bulletins
- **Live civic data** — server-proxied feeds for weather (Open-Meteo), earthquakes (Phivolcs), and DPWH infrastructure projects
- **Interactive map** — Leaflet map of Lucena City with boundary data
- **Contributor portal** — authenticated community member profiles with role-based access

## Tech Stack

- [Next.js](https://nextjs.org) 16+ (App Router) · React 19 · TypeScript
- Tailwind CSS v4 with a minimalist Material Design 3-inspired design system
- Leaflet / react-leaflet for mapping
- Supabase (Postgres + Auth) for contributor profiles
- Server Components by default; live data fetched server-side with `revalidate` caching

## Design Philosophy

BetterLucenaCity is built around a few civic-minded principles:

- **Minimalist Material Design 3 (Material You).** Clean surfaces, ample whitespace, restrained color, and purposeful motion. A deep teal/forest green primary with warm amber secondary reflects Lucena City's identity, paired with neutral surfaces and subtle elevation (1dp / 3dp / 6dp) for cards, navigation, and dialogs.
- **Accessible by default.** Clear typographic hierarchy (Roboto/Inter), high contrast, and keyboard-friendly components so the platform works for every citizen.
- **Server-first, light on the client.** Server Components do the heavy lifting; only interactive pieces (maps, live feeds, theme toggle, forms) are Client Components. This keeps pages fast and resilient.
- **Facts-first, never invented data.** Government details, hotlines, and records are verified before publishing. Where verified values are unavailable, placeholders are clearly marked rather than guessed.
- **Bayanihan over partisanship.** The project is non-partisan and community-driven, designed to invite contribution while maintaining data accuracy and accountability.

## Database Schema

The application uses Supabase (PostgreSQL) to store contributor profiles. The schema is defined via SQL migrations.

### `users` table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | Primary key, FK → `auth.users(id)` ON DELETE CASCADE |
| `email` | `varchar` | Unique, NOT NULL |
| `first_name` | `varchar` | — |
| `last_name` | `varchar` | — |
| `username` | `varchar` | Unique, NOT NULL |
| `avatar_url` | `text` | — |
| `user_type` | `user_type` (enum) | — |
| `date_added` | `timestamptz` | Default `now()` |

### `user_type` enum

```
'Head Maintainer' | 'Maintainer' | 'Data Collaborator' | 'Data Validator' | 'Tester'
```

### Security

- Row Level Security (RLS) is enabled on `users`.
- Policy: any authenticated user can read all profiles.
- Policy: a user can update only their own profile (`auth.uid() = id`).

## Supabase Configuration

The app uses [Supabase](https://supabase.com) for its PostgreSQL database and authentication (contributor profiles). Two sets of credentials are needed: server-side (secret) and public (browser-safe) keys.

### Environment Variables

Create a `.env` file in the project root with the following variables (do **not** commit it — it is gitignored):

```env
# Server-side (secret) — used by server components and route handlers
NEXT_SUPABASE_PROJECT_URL=
NEXT_SUPABASE_PASSWORD=
NEXT_SUPABASE_PUBLISHABLE_KEY=

# Public (browser-safe) — exposed to the client, prefixed with NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_SUPABASE_PROJECT_URL` | Server | Supabase project URL for server-side client |
| `NEXT_SUPABASE_PASSWORD` | Server | Database / service role password for server-side access |
| `NEXT_SUPABASE_PUBLISHABLE_KEY` | Server | Supabase publishable key for server-side client |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL exposed to the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key exposed to the browser (safe by RLS) |

> **Note:** The `NEXT_PUBLIC_*` values are embedded in the client bundle and must remain safe to expose. Keep all data protected with Row Level Security (RLS) — see [Database Schema](#database-schema).

Apply the SQL migrations in `supabase/migrations/` to set up the `users` table and RLS policies before running the app.

## File Structure

```
src/
  app/                      # Next.js App Router pages and API routes
    api/                    # Route handlers proxying external data sources
      budget/national/
      contribute/
      dpwh/projects/
      earthquakes/
      geography/boundary/
      legal/documents/
      weather/
    auth/callback/          # Supabase auth callback
    announcements/          # Announcements page
    contact/                # Contact page
    contribute/             # Contributor form page
    contributors/           # Contributors listing page
    legal/                  # Legal documents / ordinances page
    services/               # Services directory page
    transparency/           # Transparency dashboard page
    layout.tsx              # Root layout
    page.tsx                # Home page
    globals.css             # Tailwind + design tokens
    middleware.ts           # Auth/session middleware
  components/
    layout/                 # Header, footer, hotlines, page headers
    live/                   # Live civic data client components
    map/                    # Leaflet map components
    sections/               # Home page sections (hero, about, services, etc.)
    theme/                  # Theme provider + toggle
    transparency/           # National budget section
    ui/                     # Reusable primitives (Card, Button)
  lib/
    data/                   # Local site content and sample data
    sources/                # Server-side clients for external APIs
    supabase/               # Supabase client/server helpers
    cache.ts                # Revalidation cache helpers
    functions.ts            # Shared utilities
  types/                    # TypeScript type declarations
public/
  better-lucena-city.png    # Brand logo
  better-lucena-city.svg
  lucena-seal.svg           # Official city seal
  lucena-land-logo.svg
supabase/
  migrations/               # SQL schema migrations
```

## Getting Started

```bash
git clone https://github.com/<your-username>/BetterLucenaCity.git
cd BetterLucenaCity
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
npm run gh-test # eslint + next build (run before pushing)
```

## Data Sources

External data is proxied through our own route handlers with attribution included:

| Feed | Source |
|------|--------|
| Weather | Open-Meteo |
| Earthquakes | earthquakeapi.forestparty223 |
| Infrastructure projects | DPWH Infrastructure Transparency Portal |

Official service details, hotline numbers, and records are verified before publishing. Placeholders are clearly marked when verified values are unavailable — never invent government data.

## Contributing

Salamat sa pag-contribute! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started, our code style rules, and data accuracy guidelines.

> **Beyond code:** This project lives on trustworthy public information. You can contribute by **gathering, verifying, validating, and sharing** data — no coding needed. Anyone is welcome to submit a report via [`/contribute`](/contribute) **as long as it is valid, from a reliable source, and includes supporting documents** (link, PDF, photo, or reference no.) whenever possible.

- **Data & transparency reports** — submit via the private in-app `/contribute` form (sign-in required) — **do not use GitHub Issues** for data. See [CONTRIBUTING.md — Contributing Data & Reports](CONTRIBUTING.md#contributing-data--reports-no-code-needed).
- **Corrections & large datasets → private 3-way discussion on the website (not GitHub)** — these submissions open a private thread between the **Source** (you), the **Data Validator**, and the **Head Maintainer** (admin) where questions, supporting documents, and the final decision stay contained. Kept off GitHub Issues to protect contributor privacy and mental health.
- **Want to do more? Register for a role** — after signing in you may request to become a **Data Collaborator** (regular data gatherer) or **Data Validator** (reviews submissions before publication). Validators must have research knowledge to prevent false information and must remain **strictly non-partisan** — no cherry-picking data to favor or oppose any political party. See [CONTRIBUTING.md — Data Validator requirements](CONTRIBUTING.md#create-an-account--data-gathering--validator-roles).
- Report **code bugs** via [Issues](../../issues) — for **data inaccuracies**, use the private [`/contribute`](../../contribute) form (with sources + supporting documents) so the discussion stays between you, the Validator, and the Head Maintainer for privacy
- Please review our [Code of Conduct](CODE_OF_CONDUCT.md)
- Security vulnerabilities: see [SECURITY.md](SECURITY.md) — do not open public issues for them
- Discussion Board: To welcome all contributors, please read this [Discussion](https://github.com/RyannKim327/BetterLucenaCity/discussions/19) for more details.

## License

Distributed under the [MIT License](LICENSE.md).
