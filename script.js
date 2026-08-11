const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const leadForm = document.querySelector('#lead-form');
const formNote = document.querySelector('#form-note');
const contactEndpoint = '/api/contact';

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const closeMenu = () => {
  navLinks?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
};

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton?.focus();
  }
});

const selectedService = new URLSearchParams(window.location.search).get('service');
const serviceSelect = document.querySelector('#service');

if (selectedService && serviceSelect instanceof HTMLSelectElement) {
  const optionExists = [...serviceSelect.options].some((option) => option.value === selectedService);
  if (optionExists) serviceSelect.value = selectedService;
}

const setFormState = (type, message) => {
  if (!formNote) return;
  formNote.classList.remove('success', 'error');
  if (type) formNote.classList.add(type);
  formNote.textContent = message;
};

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!leadForm.reportValidity()) return;

  const submitButton = leadForm.querySelector('.form-submit');
  const data = new FormData(leadForm);
  const chosenService = serviceSelect instanceof HTMLSelectElement
    ? serviceSelect.selectedOptions[0]?.textContent?.trim()
    : data.get('service')?.toString().trim();
  const payload = {
    name: data.get('name')?.toString().trim(),
    email: data.get('email')?.toString().trim(),
    company: data.get('company')?.toString().trim(),
    service: chosenService,
    urgency: data.get('urgency')?.toString().trim(),
    message: data.get('message')?.toString().trim(),
    source: window.location.href,
    _honey: data.get('_honey')?.toString().trim()
  };

  if (!(submitButton instanceof HTMLButtonElement)) {
    setFormState('error', `No se encontró el botón de envío. Escribe a ${'contacto@fariaslabs.cl'}.`);
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando…';
    setFormState(null, 'Enviando solicitud de forma segura…');

    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok === false) {
      throw new Error(result.error || 'No pudimos enviar la solicitud.');
    }

    leadForm.reset();
    setFormState('success', 'Solicitud enviada. Oscar recibió tu diagnóstico inicial y responderá en menos de un día hábil.');
  } catch (error) {
    console.error('No se pudo enviar el formulario', error);
    setFormState('error', error instanceof Error ? error.message : 'No se pudo enviar. Escribe a contacto@fariaslabs.cl.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar diagnóstico';
  }
});
