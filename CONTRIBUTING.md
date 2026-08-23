# Contributors

Salamat sa pag-contribute! This guide covers everything you need to start helping build the BetterGov.ph portal for Lucena City.

## About the Project

BetterLucenaCity is a community-driven platform that makes Lucena City's government information and public services more accessible, transparent, and easy to navigate.

## Ways to Contribute

- **Code** — new features, bug fixes, performance improvements
- **Data** — verify LGU service details, hotline numbers, and official records
- **Design** — accessibility audits, UI polish following our Material Design 3 system
- **Content** — bilingual copy (English/Tagalog), documentation, translations
- **Research** — identify public data sources worth integrating

## Getting Started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/betterlucenacity.git
   cd betterlucenacity
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Before opening a pull request, verify your changes:

   ```bash
   npm run lint
   npm run build
   ```

## Project Structure

```
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

## Ground Rules

### Code Style

- Server Components by default; use Client Components only when interactivity requires it
- No heavy component libraries — prefer composable Tailwind utilities
- Use the design tokens in `app/globals.css` (colors, elevation shadows) instead of hardcoding values
- TypeScript strict mode must pass; no `any`

### Data Accuracy

This is a government-facing project, so accuracy matters:

- **Never invent official data.** Hotlines, addresses, officials' names, and fees must come from verified sources. Use clearly marked placeholders when real values are unavailable.
- **Cite sources.** When adding external data integrations, include the source name and attribution URL in the response payload.
- **Cache responsibly.** Upstream fetches should use `next: { revalidate }` so we don't hammer public government APIs.

### Civic Values

- Non-partisan: no campaign material, no endorsements
- Accessible: semantic HTML, keyboard navigation, sufficient contrast
- Bilingual-friendly: English and Filipino are both welcome in UI copy

## Submitting Changes

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Commit with a clear message describing *what* and *why*
3. Push to your fork and open a Pull Request against `main`
4. Describe what changed and how to test it; link any related issues

## Reporting Issues

When filing a bug, please include:

- What you expected vs. what happened
- Steps to reproduce
- Screenshots if visual
- For data inaccuracies: the correct value **and its source**

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
