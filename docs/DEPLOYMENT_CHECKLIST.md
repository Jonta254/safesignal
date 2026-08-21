# Deployment checklist

## Before merge

- Frozen lockfile install, lint, TypeScript, tests and production build pass.
- Dependency audit and tracked-file secret scan reviewed.
- `git diff --check` passes.
- Schema changes are backward-compatible and have reviewed rollback steps.
- No production provider is used by tests.
- Product claims match configured capabilities.
- Privacy/security documentation reflects data flow.

## Preview

- Use separate preview secrets and data.
- Keep `SAFESIGNAL_PRODUCT_MODE=local-preview` unless cloud-preview infrastructure is explicitly approved.
- Verify health, all routes, local recovery, denied GPS, corrupted storage and browser console.
- Do not provide production notification credentials.

## Production

- Confirm commit SHA, reviewer and change window.
- Confirm backup/restore readiness before database changes.
- Verify provider/queue/auth/database health without sending a real alert.
- Deploy, wait for Ready, test stable alias, inspect errors, and confirm stale-data indicators.
- Roll back if health, authorization, deadlines or UI claims are incorrect.

## Monitored mode gate

Never set `monitored-production` until database, authentication, queue signing and notification-provider configuration exist and operational launch blockers in PRODUCTION_READINESS.md are closed.