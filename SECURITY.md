# SafeSignal security policy

## Supported status

This repository is a prototype. Security fixes target the current default branch. It is not an audited or certified monitoring service.

## Reporting a vulnerability

Do not open a public issue containing personal data, credentials, exploit details, GPS coordinates, phone numbers, or safety records. Contact the repository owner privately through the GitHub account associated with this repository. Include the affected commit, route, impact, reproduction steps using synthetic data, and suggested mitigation. Do not test against real workers or send alerts.

## Security model

- Privileged configuration is server-only. Never use a `NEXT_PUBLIC_` prefix for database, authentication, queue or notification secrets.
- Local session data is untrusted and is never sufficient to grant a cloud role.
- Future server mutations must authenticate the user and independently verify organization, role, ownership, action and state transition.
- Logs must exclude tokens, passwords, full phone numbers, full coordinates and safety notes.
- Monitored production fails closed unless required server configuration exists.
- Security controls are engineering practices, not SOC 2, ISO 27001, ISO 45001, GDPR, HIPAA or other certification.

## Secret handling

Use Vercel encrypted environment variables or an approved secret manager. Separate development, preview and production. Rotate after suspected exposure, staff changes and provider incidents. Revoke before replacing. Never paste values into issues, commits, screenshots or logs.

## Dependency and disclosure process

CI runs frozen installation, lint, TypeScript, tests, build, dependency audit and a basic tracked-file secret-pattern scan. Dependency findings require impact review; do not suppress high-severity issues without a documented reason.