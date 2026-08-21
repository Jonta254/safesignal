# SafeSignal

SafeSignal is a functional, on-device lone-worker check-in prototype. It combines a safety-information website, a timestamp-based personal check-in flow, and a clearly labelled sample supervisor dashboard.

> SafeSignal does not send SMS, make phone calls, dispatch emergency services, provide live cloud supervision, or replace a workplace risk assessment and emergency procedure.

## Current product

- Pre-session work, contact, GPS, notification and device-readiness review
- Absolute-deadline countdowns that survive refresh and browser timer throttling
- Normal, approaching, due-soon, grace and overdue states
- Local sound, vibration and browser notifications where supported and permitted
- Versioned active-session recovery and legacy localStorage migration
- Optional GPS evidence with accuracy and capture time
- Completed-session history, copy and plain-text export
- Responsive supervisor preview with sample workers separated from real device-local records
- Privacy, terms and safety, accessibility, FAQ and official-guidance information

## Current limitations

- No authenticated accounts, organizations or cloud synchronization
- No remote monitoring or server-owned deadlines
- No automatic messages, calls, acknowledgements or escalation
- No emergency-service integration
- No continuous tracking
- Browser background behavior, storage, GPS, sound, vibration and notifications vary by device and permission
- No claim of ISO certification, legal compliance or formal accessibility conformance

## Local development

SafeSignal uses pnpm and Node.js 20 or later.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
```

Browser verification scripts in `scripts/` cover the session lifecycle, recovery, GPS denial and unavailability, dashboard filtering, local records, responsive layout and console errors.

## Local data

The current product uses these versioned browser-storage keys:

- `ss_active_session_v2` for the active session
- `ss_sessions_v2` for completed records
- `ss_sessions` as a read-only legacy migration source

Records can contain worker, site, task, emergency-contact, safety-note, timestamp and optional GPS information. Data is not currently uploaded by the check-in or dashboard. Users should delete records or clear site data before leaving a shared device.

## Routes

- `/` product, industry and safety information
- `/checkin` complete personal check-in lifecycle
- `/dashboard` sample supervisor preview and device-local history
- `/privacy` local-data notice
- `/terms` prototype terms and safety boundaries
- `/accessibility` tested behavior and known limitations

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the public origin so metadata URLs resolve correctly. The optional `WAITLIST_WEBHOOK_URL` is used only by the waitlist API route; without it, the route returns an explicit configuration error.

Before positioning SafeSignal as a monitored safety service, add authenticated server-owned sessions, tested delivery and acknowledgement, operational monitoring, incident response, retention and access controls, and jurisdiction-specific safety, privacy and legal review.
