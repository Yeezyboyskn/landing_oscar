const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const leadForm = document.querySelector('#lead-form');
const formNote = document.querySelector('#form-note');

year.textContent = new Date().getFullYear();

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

leadForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(leadForm);
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const company = data.get('company')?.toString().trim() || 'No indicado';
  const service = data.get('service')?.toString().trim();
  const urgency = data.get('urgency')?.toString().trim();
  const message = data.get('message')?.toString().trim();

  const subject = `Diagnóstico Farias Labs - ${service || 'Nueva consulta'}`;
  const body = [
    'Hola Farias Labs,',
    '',
    'Quiero solicitar un diagnóstico inicial.',
    '',
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Empresa o proyecto: ${company}`,
    `Necesidad: ${service}`,
    `Urgencia: ${urgency}`,
    '',
    'Problema u oportunidad:',
    message,
    '',
    'Quedo atento/a a los próximos pasos.'
  ].join('\n');

  const mailto = `mailto:contacto@fariaslabs.cl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  if (formNote) {
    formNote.textContent = 'Listo: se abrió tu correo con el mensaje preparado. Solo debes revisar y enviar.';
  }
});
