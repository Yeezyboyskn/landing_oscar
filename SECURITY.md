# Security policy

## Secret handling

- Never commit credentials, API keys, private keys, webhook URLs, `.env` files, or `.dev.vars`.
- Store local development secrets only in `.dev.vars`.
- Store deployment credentials in GitHub Actions secrets and runtime credentials in Cloudflare Pages secrets.
- Treat a committed secret as compromised even after deleting it: revoke or rotate it first, then remove it from Git history.
- Run `npm run scan:security` before every push.

## Required deployment secrets

GitHub Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Cloudflare Pages runtime:

- `RESEND_API_KEY`, or
- `LEADS_WEBHOOK_URL`

Only the variable names belong in this repository. Real values must remain in the relevant secret manager.

## Reporting

Report suspected exposures privately to `contacto@fariaslabs.cl`. Do not open a public issue containing a credential or personal information.
