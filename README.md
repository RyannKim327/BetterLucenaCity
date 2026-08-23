# BetterLucenaCity

**Transparent. Accessible. Para sa mamamayan.**

BetterLucenaCity is a community-driven platform that makes Lucena City's government information and public services more accessible, transparent, and easy to navigate.

Non-partisan. Facts-first. Built in the spirit of *bayanihan*.

## Features

- **Services directory** — LGU services with requirements, fees, and office locations
- **Transparency dashboard** — budget and project data surfaced from public sources
- **Ordinances & legal documents** — searchable local legislation
- **Announcements** — city advisories and bulletins
- **Live civic data** — server-proxied feeds for weather (Open-Meteo), earthquakes (USGS), and DPWH infrastructure projects
- **Interactive map** — Leaflet map of Lucena City with boundary data

## Tech Stack

- [Next.js](https://nextjs.org) 16+ (App Router) · React 19 · TypeScript
- Tailwind CSS v4 with a minimalist Material Design 3-inspired design system
- Leaflet / react-leaflet for mapping
- Server Components by default; live data fetched server-side with `revalidate` caching

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
```

## Project Structure

```
src/
  app/                  # Next.js App Router pages and API routes
    api/                # Route handlers proxying external data sources
  components/
    layout/             # Header, footer, page headers
    live/               # Live civic data client components
    map/                # Leaflet map components
    ui/                 # Reusable primitives (Card, Button)
  lib/
    data/               # Local site content and sample data
    sources/            # Server-side clients for external APIs
```

## Data Sources

External data is proxied through our own route handlers with attribution included:

| Feed | Source |
|------|--------|
| Weather | Open-Meteo |
| Earthquakes | USGS Earthquake Hazards Program |
| Infrastructure projects | DPWH Infrastructure Transparency Portal |

Official service details, hotline numbers, and records are verified before publishing. Placeholders are clearly marked when verified values are unavailable — never invent government data.

## Contributing

Salamat sa pag-contribute! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started, our code style rules, and data accuracy guidelines.

- Report bugs and data inaccuracies (with sources!) via [Issues](../../issues)
- Please review our [Code of Conduct](CODE_OF_CONDUCT.md)
- Security vulnerabilities: see [SECURITY.md](SECURITY.md) — do not open public issues for them

## License

Distributed under the [MIT License](LICENSE).
