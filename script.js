document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initActiveLinks();
  initContactForm();
});

function initNavigation() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', (event) => {
    if (!toggle.contains(event.target) && !links.contains(event.target)) close();
  });
}

function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  const mark = () => {
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 90) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', mark, { passive: true });
  mark();
}

const WHATSAPP_NUMBER = '77074312016';

function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Атыңызды енгізіңіз';
      if (value.trim().length < 2) return 'Аты кемінде 2 әріп болуы керек';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email мекенжайын енгізіңіз';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Дұрыс email енгізіңіз';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Хабарламаны жазыңыз';
      if (value.trim().length < 10) return 'Хабарлама кемінде 10 әріп болуы керек';
      return '';
    },
  };

  const showError = (fieldId, message) => {
    const errorEl = document.getElementById(`${fieldId}Error`);
    const input = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    input.classList.toggle('is-invalid', Boolean(message));
  };

  const validateField = (fieldId) => {
    const input = document.getElementById(fieldId);
    const error = validators[fieldId](input.value);
    showError(fieldId, error);
    return !error;
  };

  ['name', 'email', 'message'].forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    input.addEventListener('blur', () => validateField(fieldId));
    input.addEventListener('input', () => {
      const errorEl = document.getElementById(`${fieldId}Error`);
      if (errorEl && errorEl.textContent) validateField(fieldId);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const ok = ['name', 'email', 'message'].map(validateField).every(Boolean);
    if (!ok) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = encodeURIComponent(
      [
        'Сәлем! NURIS.dev портфолио сайтынан хабарлама:',
        '',
        `Аты: ${name}`,
        `Email: ${email}`,
        '',
        'Хабарлама:',
        message,
      ].join('\n'),
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (successMsg) successMsg.hidden = false;
    form.reset();
    ['name', 'email', 'message'].forEach((fieldId) => showError(fieldId, ''));
  });
}
