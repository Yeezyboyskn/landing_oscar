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

El frontend, la API y el formulario de contacto ya están desplegados en Cloudflare Pages.

Verificación rápida:

```bash
curl -i https://fariaslabs.cl/api/contact
curl -i -X POST https://fariaslabs.cl/api/contact \
  -H 'content-type: application/json' \
  --data '{"name":"Test","email":"test@example.com","company":"Demo","service":"Automatización","urgency":"Esta semana","message":"Mensaje de prueba con detalle suficiente."}'
```

`GET /api/contact` debe responder:

```json
{ "ok": true, "service": "Farias Labs contact API" }
```

Un `POST` válido debe responder:

```json
{ "ok": true, "message": "Solicitud enviada correctamente." }
```

El envío real está configurado con Resend mediante `RESEND_API_KEY`. `www.fariaslabs.cl` redirige de forma canónica a `fariaslabs.cl` vía middleware de Cloudflare Pages.

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
- Si Resend no está configurado, el endpoint responde 503 explicando que falta configuración.

### Alternativa: webhook

```text
LEADS_WEBHOOK_URL=https://...
```

## Deploy manual

```bash
npx wrangler pages deploy . --project-name fariaslabs --branch main
```

## Deploy automático

El repo incluye GitHub Actions en `.github/workflows/deploy-cloudflare-pages.yml`.

Cada push a `main` ejecuta:

1. `npm ci`
2. `npm run check`
3. `npm run scan:security`
4. `npx wrangler pages deploy . --project-name fariaslabs --branch main`

Secrets requeridos en GitHub → Settings → Secrets and variables → Actions:

```text
CLOUDFLARE_API_TOKEN=***
CLOUDFLARE_ACCOUNT_ID=***
```

El token debe tener permisos para desplegar Cloudflare Pages en el proyecto `fariaslabs`.

### Repositorio privado

El repositorio puede mantenerse privado sin afectar la publicación pública de `https://fariaslabs.cl`.

Mientras los secrets `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` existan en GitHub Actions, el workflow puede seguir desplegando automáticamente a Cloudflare Pages en cada push a `main`. La privacidad del repositorio solo limita quién puede ver el código fuente en GitHub; no cambia la visibilidad del sitio publicado.
