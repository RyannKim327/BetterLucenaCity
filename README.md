# BetterLucenaCity

![Better Lucena City](public/better-lucena-city.png)

**Transparent. Accessible. Para sa mamamayan.**

BetterLucenaCity is a community-driven platform that makes Lucena City's government information and public services more accessible, transparent, and easy to navigate.

Non-partisan. Facts-first. Built in the spirit of *bayanihan*.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Database Schema](#database-schema)
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

- Report bugs and data inaccuracies (with sources!) via [Issues](../../issues)
- Please review our [Code of Conduct](CODE_OF_CONDUCT.md)
- Security vulnerabilities: see [SECURITY.md](SECURITY.md) — do not open public issues for them

## License

Distributed under the [MIT License](LICENSE.md).
