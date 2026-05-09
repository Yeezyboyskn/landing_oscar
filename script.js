const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const leadForm = document.querySelector('#lead-form');
const formNote = document.querySelector('#form-note');
const contactEndpoint = '/api/contact';

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

const setFormState = (type, message) => {
  if (!formNote) return;
  formNote.classList.remove('success', 'error');
  if (type) formNote.classList.add(type);
  formNote.textContent = message;
};

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = leadForm.querySelector('.form-submit');
  const data = new FormData(leadForm);

  const payload = {
    name: data.get('name')?.toString().trim(),
    email: data.get('email')?.toString().trim(),
    company: data.get('company')?.toString().trim(),
    service: data.get('service')?.toString().trim(),
    urgency: data.get('urgency')?.toString().trim(),
    message: data.get('message')?.toString().trim(),
    source: window.location.href,
    _honey: data.get('_honey')?.toString().trim()
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    setFormState(null, 'Enviando solicitud a Farias Labs...');

    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok === false) {
      throw new Error(result.error || `Error HTTP ${response.status}`);
    }

    leadForm.reset();
    setFormState('success', 'Solicitud enviada. Gracias: Farias Labs recibió tu diagnóstico inicial.');
  } catch (error) {
    console.error('No se pudo enviar el formulario', error);
    setFormState('error', error.message || 'No se pudo enviar automáticamente. Escríbenos a contacto@fariaslabs.cl.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar diagnóstico';
  }
});
