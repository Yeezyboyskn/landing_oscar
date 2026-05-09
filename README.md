# Farias Labs Landing

Landing page oficial de Farias Labs con formulario de leads y backend serverless.

## Arquitectura

- Frontend estático: HTML/CSS/JS.
- Backend: Cloudflare Pages Functions.
- Endpoint de contacto: `POST /api/contact`.
- Envío de leads:
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

Configurar en Cloudflare → Pages → proyecto → Settings → Environment variables:

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

## Deploy recomendado

El backend requiere Cloudflare Pages. GitHub Pages no ejecuta `/functions`.

Pasos:

1. Crear proyecto en Cloudflare Pages conectado al repo `Yeezyboyskn/landing_oscar`.
2. Framework preset: `None`.
3. Build command: vacío.
4. Build output directory: `/`.
5. Variables de entorno: configurar Resend o webhook.
6. Dominio custom: `fariaslabs.cl`.
7. DNS: apuntar el dominio a Cloudflare Pages.

## Verificación

```bash
curl -i https://fariaslabs.cl/api/contact
```

Debe responder JSON similar a:

```json
{ "ok": true, "service": "Farias Labs contact API" }
```

Para probar envío real, usar el formulario de la landing o un POST JSON al endpoint.
