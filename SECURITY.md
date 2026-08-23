# Security Policy

## Supported Versions

This project is in early development. Only the latest version on `main` receives security fixes.

| Version | Supported |
|---------|-----------|
| latest `main` | ✅ |
| older tags/commits | ❌ |

## Reporting a Vulnerability

Salamat for helping keep this civic portal safe. If you discover a security vulnerability, please report it responsibly:

- **Do NOT open a public GitHub issue** for security vulnerabilities.
- Email **security@bettergov.ph** with:
  - A description of the vulnerability
  - Steps to reproduce or a proof of concept
  - The affected files, routes, or dependencies
  - Any potential impact you have identified
- Include the word **"SECURITY"** in the subject line so it is routed quickly.

You should receive an acknowledgment within **72 hours**. We will keep you informed of progress toward a fix and may ask follow-up questions during triage.

Please allow reasonable time for a fix to be released before any public disclosure.

## Scope

The following are in scope:

- The Next.js application in this repository (pages, API route handlers under `app/api`, server-side clients under `lib/sources`)
- Dependency vulnerabilities affecting the deployed application
- Misconfiguration that would leak data or allow unauthorized access

Out of scope:

- Vulnerabilities in third-party government APIs we proxy (please report those to the respective LGU/national agency)
- Social engineering, physical attacks, or denial-of-service via volume
- Issues in sample/placeholder data

## Security Expectations for Contributors

To keep the codebase safe by default:

- Never commit secrets, API keys, or credentials — use environment variables (`.env.local`, never committed)
- Validate and sanitize all external data before rendering; treat upstream API responses as untrusted
- Keep `next: { revalidate }` caching on upstream fetches so we do not hammer public government endpoints
- Run `npm audit` before upgrading dependencies and address known advisories
- Report data inaccuracies through normal issues — they are quality concerns, not security ones

Thank you for helping make Lucena City's civic data safer for everyone.
