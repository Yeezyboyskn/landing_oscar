const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });

const clean = (value, max = 2000) =>
  String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const escapeHtml = (value) =>
  clean(value, 5000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const buildLead = (body) => ({
  name: clean(body.name ?? body.nombre, 120),
  email: clean(body.email ?? body.correo, 180),
  company: clean(body.company ?? body.empresa_proyecto, 180) || 'No indicado',
  service: clean(body.service ?? body.necesidad, 180),
  urgency: clean(body.urgency ?? body.urgencia, 120),
  message: clean(body.message ?? body.mensaje, 4000),
  source: clean(body.source ?? body.origen, 240) || 'https://fariaslabs.cl',
  honey: clean(body._honey, 200)
});

const validateLead = (lead) => {
  if (lead.honey) return 'spam_detected';
  if (!lead.name || lead.name.length < 2) return 'Nombre inválido.';
  if (!lead.email || !isEmail(lead.email)) return 'Correo inválido.';
  if (!lead.service) return 'Selecciona qué necesitas.';
  if (!lead.urgency) return 'Selecciona la urgencia.';
  if (!lead.message || lead.message.length < 12) return 'Describe el problema con un poco más de detalle.';
  return null;
};

const leadEmail = (lead) => {
  const subject = `Nuevo diagnóstico Farias Labs - ${lead.service}`;
  const text = [
    'Nuevo lead desde fariaslabs.cl',
    '',
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    `Empresa/proyecto: ${lead.company}`,
    `Necesidad: ${lead.service}`,
    `Urgencia: ${lead.urgency}`,
    `Origen: ${lead.source}`,
    '',
    'Mensaje:',
    lead.message
  ].join('\n');

  const html = `
    <h2>Nuevo diagnóstico Farias Labs</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif">
      <tr><td><strong>Nombre</strong></td><td>${escapeHtml(lead.name)}</td></tr>
      <tr><td><strong>Correo</strong></td><td>${escapeHtml(lead.email)}</td></tr>
      <tr><td><strong>Empresa/proyecto</strong></td><td>${escapeHtml(lead.company)}</td></tr>
      <tr><td><strong>Necesidad</strong></td><td>${escapeHtml(lead.service)}</td></tr>
      <tr><td><strong>Urgencia</strong></td><td>${escapeHtml(lead.urgency)}</td></tr>
      <tr><td><strong>Origen</strong></td><td>${escapeHtml(lead.source)}</td></tr>
    </table>
    <h3>Mensaje</h3>
    <p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>
  `;

  return { subject, text, html };
};

const sendWithResend = async (env, lead) => {
  const { subject, text, html } = leadEmail(lead);
  const to = env.CONTACT_TO || 'contacto@fariaslabs.cl';
  const from = env.CONTACT_FROM || 'Farias Labs <contacto@fariaslabs.cl>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject,
      text,
      html
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend error ${response.status}: ${detail}`);
  }

  return response.json();
};

const sendToWebhook = async (env, lead) => {
  const response = await fetch(env.LEADS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'lead.created', lead })
  });

  if (!response.ok) {
    throw new Error(`Webhook error ${response.status}: ${await response.text()}`);
  }
};

export async function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestPost({ request, env }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return json({ ok: false, error: 'Content-Type debe ser application/json.' }, 415);
    }

    const body = await request.json();
    const lead = buildLead(body);
    const validationError = validateLead(lead);

    if (validationError === 'spam_detected') {
      return json({ ok: true, message: 'Solicitud recibida.' });
    }

    if (validationError) {
      return json({ ok: false, error: validationError }, 400);
    }

    if (env.RESEND_API_KEY) {
      await sendWithResend(env, lead);
    } else if (env.LEADS_WEBHOOK_URL) {
      await sendToWebhook(env, lead);
    } else {
      return json({
        ok: false,
        error: 'Backend configurado, pero falta RESEND_API_KEY o LEADS_WEBHOOK_URL.'
      }, 503);
    }

    return json({ ok: true, message: 'Solicitud enviada correctamente.' });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'No se pudo procesar la solicitud.' }, 500);
  }
}

export async function onRequestGet() {
  return json({ ok: true, service: 'Farias Labs contact API' });
}
