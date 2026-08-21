# Operations runbook

## Current local-preview incident

SafeSignal cannot remotely observe or resolve a worker incident. Direct users to their agreed workplace emergency procedure. Never claim a contact was notified.

## Future monitored-service signals

Minimum operational alerts: health/readiness failure, overdue transition delay, queue age/depth, escalation permanent failure, provider callback verification failure, API latency/error rate, authentication anomalies, database saturation, stale dashboard data and backup/restore failure.

## Triage

1. Record incident ID and correlation ID without copying personal details into chat.
2. Identify scope: browser-only, API, identity, database, queue or provider.
3. Fail visibly; do not show green/confirmed when authoritative state is unavailable.
4. Pause new monitored sessions if deadlines or delivery cannot be guaranteed.
5. Preserve append-only audit and provider events.
6. Follow the approved human escalation procedure; the software does not dispatch emergency services.
7. Communicate status and limitations to authorized supervisors.
8. Resolve, reconcile duplicate/late jobs idempotently, and complete a blameless review.

## Provider outage

Stop claiming sends; mark attempts pending or failed using confirmed provider status. Retry with bounded exponential backoff, then dead-letter. Use the approved manual fallback. Never infer delivery from API acceptance.

## Deployment during active sessions

Require backward-compatible migrations, queue workers compatible with old/new event versions, health gates, canary verification and rollback. Do not deploy destructive migrations while sessions are active.

## Backup and recovery design targets

No production database is configured, so backups do not currently exist. Before launch, enable encrypted managed backups and point-in-time recovery. Proposed initial targets: RPO 15 minutes, RTO 4 hours, subject to risk assessment. Test restoration quarterly in isolation and record evidence. Preserve audit/event ordering and reconcile queued escalation jobs after restore.

## Secret incident

Revoke exposed credentials, rotate dependent credentials, invalidate sessions if relevant, review audit logs, assess data exposure, notify accountable owners, and document prevention work. Never print secret values during investigation.