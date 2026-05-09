# Farias Labs Landing

Landing page oficial de Farias Labs con formulario de leads y backend serverless.

## Arquitectura

- Frontend estático: HTML/CSS/JS.
- Backend: Cloudflare Pages Functions.
- Endpoint de contacto: `POST /api/contact`.
- Deploy actual: Cloudflare Pages project `fariaslabs`.
- Dominio principal: `https://fariaslabs.cl`.
- Redirección: `www.fariaslabs.cl` → `fariaslabs.cl`.

## Estado actual

El frontend y la API ya están desplegados en Cloudflare Pages.

Verificación:

```bash
curl -i https://fariaslabs.cl/api/contact
```

Debe responder:

```json
{ "ok": true, "service": "Farias Labs contact API" }
```

Para que el formulario envíe correos reales falta configurar un proveedor de salida:

- Recomendado: Resend (`RESEND_API_KEY`).
- Alternativo: webhook (`LEADS_WEBHOOK_URL`).

## Desarrollo local

```bash
npm install
npm run check
npm run dev
```

Para probar el backend local, copia `.env.example` a `.dev.vars` y completa variables reales.

```bash
cp .env.example .dev.vars
```

No commitear `.dev.vars`, `.env` ni secretos.

## Variables de entorno en Cloudflare Pages

Configurar en Cloudflare → Pages → `fariaslabs` → Settings → Environment variables.

### Opción recomendada: Resend

```text
RESEND_API_KEY=<api key de Resend>
CONTACT_TO=contacto@fariaslabs.cl
CONTACT_FROM=Farias Labs <contacto@fariaslabs.cl>
```

Notas:

- `CONTACT_FROM` debe usar un dominio verificado por Resend para producción.
- Si Resend todavía no está configurado, el endpoint responderá 503 explicando que falta configuración.

### Alternativa: webhook

```text
LEADS_WEBHOOK_URL=https://...
```

## Deploy manual

```bash
npx wrangler pages deploy . --project-name fariaslabs --branch main
```

## Deploy desde GitHub

Siguiente mejora recomendada: conectar Cloudflare Pages directamente al repo `Yeezyboyskn/landing_oscar` para deploy automático en cada push a `main`.
