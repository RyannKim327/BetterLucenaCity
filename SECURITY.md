# Security Policy

## Supported Versions

This project is in early development. Only the latest version on `main` receives security fixes.

| Version | Supported |
|---------|-----------|
| latest `main` (0.1.x) | Yes |
| < 0.1 | No |

## Reporting a Vulnerability

We take security seriously at BetterGov.ph Lucena City. Salamat for helping keep this civic portal safe.
If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@bettergov.ph**

Include in your report:

- Description of the vulnerability
- Steps to reproduce or a proof of concept
- Affected files, routes, or dependencies
- Potential impact
- Suggested fix (if any)

Include the word **"SECURITY"** in the subject line so it is routed quickly.

### Response Timeline

| Action | Timeframe |
|--------|-----------|
| Acknowledgment | Within 72 hours |
| Initial Assessment | Within 7 days |
| Resolution Target | Within 30 days |
| Public Disclosure | After fix is deployed |

We will keep you informed of progress toward a fix and may ask follow-up questions during triage.

## Security Measures

### Current Implementations

**Server Security:**
- Server-side proxying of all upstream government/API requests (no direct browser-to-API exposure for data sources)
- Upstream fetches cached via `next: { revalidate }` to avoid hammering public government endpoints
- Secrets managed through environment variables (`.env.local`, never committed)
- No user authentication, sessions, or cookies handling sensitive data

**Application Security:**
- TypeScript strict typing across app routes and API handlers (`app/api`)
- React Server Components by default; minimal client-side JavaScript surface
- External API responses treated as untrusted input before rendering
- No database, forms, or server-side processing of personal data

**Data Security:**
- All data sourced from public government portals and open-data feeds
- No personally identifiable information (PII) stored or processed
- Sample/placeholder data clearly separated from live sources under `lib/sources`

### Third-Party Services

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Open-Meteo | Weather forecasts | Coordinates (Lucena City) |
| USGS Earthquake API | Earthquake advisories | None |
| Nominatim / OpenStreetMap | Boundary and map data | Query parameters (Lucena City) |
| DPWH Transparency API | Infrastructure projects | None |

## Best Practices for Contributors

When contributing code:

1. **Never commit secrets** — API keys, passwords, or credentials belong in `.env.local`
2. **Validate inputs** — Sanitize any user-facing inputs and treat upstream API responses as untrusted
3. **Keep caching enabled** — Preserve `next: { revalidate }` on upstream fetches
4. **Review dependencies** — Run `npm audit` before upgrading and address known advisories
5. **Report data inaccuracies through normal issues** — They are quality concerns, not security ones

## Scope

This security policy covers:

- The Next.js application in this repository (pages, API route handlers under `app/api`, server-side clients under `lib/sources`)
- Dependency vulnerabilities affecting the deployed application
- Misconfiguration that would leak data or allow unauthorized access
- Associated build tools and scripts

Out of scope:

- Vulnerabilities in third-party government APIs we proxy (please report those to the respective LGU/national agency)
- Social engineering, physical attacks, or denial-of-service via volume
- Issues in sample/placeholder data
- User's local environment

## Contact

For security concerns: **security@bettergov.ph**

For general inquiries: Open a GitHub issue in this repository.

---

Thank you for helping keep Lucena City's civic data secure for everyone.
