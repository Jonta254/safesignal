# SafeSignal production readiness

## Executive status

SafeSignal is a verified **local-preview** lone-worker check-in application. It is not a monitored safety service. No cloud database, authentication provider, queue, notification provider, on-call operation, or emergency dispatch is configured.

## Current architecture and data flow

The Next.js App Router serves static product pages, client-side check-in and dashboard applications, a health route, and an optional waitlist proxy. Active and completed safety sessions remain in versioned browser localStorage. GPS is requested only during readiness checks and check-ins. The dashboard's team is sample data; real device records are separated.

Trust boundaries are: user/browser, browser storage, Next.js server routes, optional waitlist webhook, future identity/database/queue/providers. Browser data, clocks, roles, coordinates, and requests are untrusted for a monitored service.

## Sensitive data inventory

| Data | Sensitivity | Current storage | Purpose | Access and logging | Retention/deletion |
|---|---|---|---|---|---|
| Worker identity, site, task | Confidential operational | Browser localStorage | Session record | Same browser profile; never server logged | User deletes record or clears site data |
| Emergency contact and phone | Highly confidential | Browser localStorage | Response-plan reference | Same browser only; never URL/log | Same as session |
| GPS, accuracy, capture time | Highly confidential | Browser localStorage | Optional location evidence | Same browser; no analytics/logging | Same as session |
| Check-in/status timestamps | Confidential safety record | Browser localStorage | Timer/history/export | Same browser | Up to 50 local records |
| Safety notes | Highly confidential | Browser localStorage | Work context | Same browser; excluded from server logs | Same as session |
| Waitlist email | Confidential | Configured external webhook only | Product contact request | Server validates; no value logged | Defined by webhook operator |
| Future organization/audit/provider data | Highly confidential | Not implemented | Monitored mode | Must be tenant/role restricted | See proposed schema policy |

## Threat model and controls

| Threat | Severity | Current control | Remaining requirement |
|---|---:|---|---|
| XSS/injection | High | React escaping, no untrusted HTML, CSP, bounded validation | CSP nonce strategy; security review |
| CSRF | Medium | No authenticated mutations; Fetch Metadata check on waitlist | Origin/CSRF tokens for future cookie-auth routes |
| Broken access control/IDOR/privilege escalation | Critical | No cloud accounts exist | Server authentication, tenant membership and ownership checks on every operation |
| Credential/secret exposure | Critical | Server-only env names; ignored env files; no public privileged keys | Managed secret store and rotation |
| Brute force/account enumeration/session fixation | High | Authentication absent | Provider controls, generic responses, secure cookie rotation, distributed rate limits |
| Timestamp manipulation/replay/duplicate jobs | Critical | Local mode honestly non-authoritative | Server timestamps, state machine, idempotency store, durable queue |
| Spoofed/stale GPS | High | Accuracy/time stored; no tamper-proof claim | Role restrictions, freshness policy; never call device GPS trusted evidence |
| Corrupted local data/imports | Medium | Version validation, migration, recovery choices | Signed/encrypted backup format before imports |
| Export injection | High | Text export; CSV-safe utility available | Apply utility to every future CSV export |
| DoS/abuse | High | Size limit and best-effort local rate limit | Edge/distributed rate limiting and provider quotas |
| Clickjacking/MIME sniffing/open redirect | High | frame-ancestors, DENY, nosniff; no open redirect | Regression testing |
| Excess retention/contact disclosure | High | Local user deletion; clear privacy disclosure | Tenant retention jobs and audited access |
| Logs/URLs leaking PII | High | Current APIs do not log PII; coordinates not in URLs | Structured redaction policy and log review |
| File upload | N/A | No upload feature | Type/size/content scanning if introduced |

Operational controls remain necessary for worker suitability decisions, rescue planning, staff training, escalation authority, provider outage handling, privacy requests, and incident response.

## Recommended production architecture

Use one modular Next.js application with managed authentication, pooled PostgreSQL, server-authorized route handlers, a durable delayed-job queue, idempotent escalation workers, provider adapters, structured redacted logging, error monitoring, and append-only safety/audit events. Scale stateless web instances horizontally. Keep deadlines and transitions server-authoritative. Do not cache live safety status publicly.

The proposed PostgreSQL schema is in [docs/production-schema.sql](docs/production-schema.sql). It is design-only and has not been applied.

## Implementation status

Implemented: local session integrity/recovery, explicit product modes, fail-closed monitored-mode gate, safe health response, hardened waitlist validation, security headers, sensitive-data disclosures, deterministic security tests, CI verification, and architecture/runbook documentation.

Interfaces/design only: organizations, roles, server sessions, audit events, queue jobs, provider delivery, webhooks, data-rights jobs, backup/restore.

Not configured: database, auth, notification provider, queue, distributed limiter, monitoring, backups, on-call response.

## Scalability and operational limits

Browser storage is device-local and bounded but not centrally durable. The waitlist limiter is instance-local and not sufficient across server instances. No server session queries, pagination, connection pool, queue depth metric, backup, or restore process exists because the associated infrastructure is absent.

## Launch blockers

1. Select and configure managed identity, PostgreSQL and a durable queue.
2. Implement and independently test tenant authorization and row isolation.
3. Implement server-authoritative session state transitions and idempotency.
4. Contract and test notification providers, delivery callbacks and dead-letter operations without emergency-service claims.
5. Establish on-call ownership, runbooks, alerting, incident review and provider fallback.
6. Define retention/legal basis, data-subject workflows, backup/PITR targets and restore tests.
7. Complete accessibility, security, privacy, occupational-safety and jurisdiction-specific legal reviews.
8. Pilot under an existing approved safety procedure.

SafeSignal must remain labelled local-preview until every applicable blocker is closed.