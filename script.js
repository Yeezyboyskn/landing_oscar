const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const leadForm = document.querySelector('#lead-form');
const formNote = document.querySelector('#form-note');
const formSubmitEndpoint = 'https://formsubmit.co/ajax/contacto@fariaslabs.cl';

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
    _subject: 'Nuevo diagnóstico desde fariaslabs.cl',
    _template: 'table',
    nombre: data.get('name')?.toString().trim(),
    correo: data.get('email')?.toString().trim(),
    empresa_proyecto: data.get('company')?.toString().trim() || 'No indicado',
    necesidad: data.get('service')?.toString().trim(),
    urgencia: data.get('urgency')?.toString().trim(),
    mensaje: data.get('message')?.toString().trim(),
    origen: 'https://fariaslabs.cl'
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    setFormState(null, 'Enviando solicitud a Farias Labs...');

    const response = await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    leadForm.reset();
    setFormState('success', 'Solicitud enviada. Gracias: Farias Labs recibió tu diagnóstico inicial.');
  } catch (error) {
    console.error('No se pudo enviar el formulario', error);
    setFormState('error', 'No se pudo enviar automáticamente. Escríbenos a contacto@fariaslabs.cl e intentaremos responder rápido.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar diagnóstico';
  }
});
