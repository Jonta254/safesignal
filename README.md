# SafeSignal

SafeSignal is a functional **local-preview** lone-worker check-in application. It provides a timestamp-based personal check-in flow, optional GPS evidence, local history/export, and a clearly labelled sample supervisor dashboard.

> SafeSignal does not send SMS, make calls, dispatch emergency services, provide live cloud supervision, or replace workplace risk assessment and emergency procedures.

## Architecture and modes

The current Next.js App Router application stores active and completed sessions in versioned browser localStorage. The server exposes only a safe health endpoint and an optional validated waitlist proxy.

- `local-preview` — current default; device-local sessions and sample dashboard
- `cloud-preview` — reserved for real accounts and durable storage; does not imply escalation
- `monitored-production` — fails closed unless database, authentication, queue signing and notification configuration exist; it must not be enabled until operational launch blockers are closed

See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md), [SECURITY.md](SECURITY.md), [production schema](docs/production-schema.sql), [operations runbook](docs/OPERATIONS_RUNBOOK.md), and [deployment checklist](docs/DEPLOYMENT_CHECKLIST.md).

## Current features

- Pre-session work/contact/device review
- Absolute-deadline countdown and refresh recovery
- Normal, approaching, due-soon, grace and overdue states
- Optional GPS capture with accuracy/time
- Versioned localStorage migration and corruption recovery
- Completed-session report copy/download
- Sample supervisor dashboard separated from real device records
- Shared image-backed SafeSignal logo, app icon and manifest
- Security headers, product-mode gate, safe health response and bounded waitlist validation

## Not configured

No database, authentication provider, cloud accounts, queue, delivery provider, distributed rate limiter, centralized monitoring, backups, on-call service, continuous tracking, or emergency integration is configured. The SQL schema is review-only and has not been applied.

## Development

Requires Node.js 20+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local`. Never expose privileged configuration with `NEXT_PUBLIC_`. Preview and production must use separate secrets and data. The waitlist endpoint must be HTTPS in production.

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
pnpm audit --audit-level high
```

CI runs frozen installation, static checks, tests, production build, dependency audit, a tracked-file secret-pattern scan, and `git diff --check`.

## Local data and privacy

`ss_active_session_v2` stores the active session; `ss_sessions_v2` stores up to 50 completed records; `ss_sessions` is read only for legacy migration. Records may contain names, phone numbers, sites, tasks, notes, timestamps and optional coordinates. They stay in the current browser and can be removed through record deletion or clearing site data.

## Routes

- `/` product and safety information
- `/checkin` local session lifecycle
- `/dashboard` sample supervisor preview and local history
- `/privacy`, `/terms`, `/accessibility`
- `/api/health` non-sensitive service/capability health
- `/api/waitlist` optional bounded webhook proxy

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin. Keep `SAFESIGNAL_PRODUCT_MODE=local-preview` until approved cloud infrastructure exists. Follow [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md). No test may send a production alert.

SafeSignal makes no claim of ISO, SOC 2, GDPR, HIPAA, accessibility or legal certification.
