/* ============================================================
   ALEX RIVERA — PORTFOLIO
   script.js
   ============================================================ */

/* ---------- DOM Cached Elements ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const typingTarget = document.getElementById('typingTarget');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const footerYear = document.getElementById('footerYear');

const sectionIds = ['about', 'skills', 'projects', 'timeline', 'contact'];
const navAnchors = document.querySelectorAll('.nav-link[data-section]');


/* ---------- Utilities ---------- */
function lerp(start, end, t) {
  return start + (end - start) * t;
}


/* ---------- Footer Year ---------- */
if (footerYear) footerYear.textContent = new Date().getFullYear();


/* ---------- Navbar Scroll Effect ---------- */
function updateNavbar() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 50);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();


/* ---------- Hamburger Menu ---------- */
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ---------- Active Nav Link on Scroll ---------- */
function updateActiveLink() {
  let currentId = sectionIds[0];
  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) currentId = id;
    }
  }
  navAnchors.forEach(anchor => {
    anchor.classList.toggle('active', anchor.dataset.section === currentId);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ---------- Back to Top ---------- */
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 600);
}
window.addEventListener('scroll', updateBackToTop, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------- Scroll Reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---------- Skill Bars Animation ---------- */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.skill-bar-fill');
      bars.forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillBarObserver.observe(skillsSection);


/* ---------- Typing Animation ---------- */
function startTyping() {
  if (!typingTarget) return;
  const phrases = [
    'fast, accessible interfaces.',
    'performant web experiences.',
    'beautiful design systems.',
    'scalable frontend architecture.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function step() {
    const currentPhrase = phrases[phraseIndex];
    const displayText = currentPhrase.substring(0, charIndex);

    typingTarget.textContent = displayText;

    if (!isDeleting && charIndex < currentPhrase.length) {
      charIndex++;
      typingSpeed = 80;
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      typingSpeed = 40;
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(step, typingSpeed);
  }
  step();
}
if (typingTarget) startTyping();


/* ---------- Contact Form Validation ---------- */
const formErrors = {
  name: document.getElementById('nameError'),
  email: document.getElementById('emailError'),
  subject: document.getElementById('subjectError'),
  message: document.getElementById('messageError')
};

const validators = {
  name(value) {
    if (!value.trim()) return 'Please enter your full name.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email(value) {
    if (!value.trim()) return 'Please enter your email address.';
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
    return '';
  },
  subject(value) {
    if (!value.trim()) return 'Please enter a subject.';
    if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
    return '';
  },
  message(value) {
    if (!value.trim()) return 'Please enter a message.';
    if (value.trim().length < 20) return 'Message must be at least 20 characters.';
    return '';
  }
};

function validateField(name, value) {
  const error = validators[name](value);
  const errorEl = formErrors[name];
  if (errorEl) {
    errorEl.textContent = error;
    const input = document.getElementById(name);
    if (input) input.classList.toggle('error', !!error);
  }
  return !error;
}

function validateForm() {
  let isValid = true;
  const data = new FormData(contactForm);
  for (const [name, value] of data) {
    if (!validateField(name, value)) isValid = false;
  }
  return isValid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    contactForm.reset();

    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    formSuccess.hidden = false;
    setTimeout(() => { formSuccess.hidden = true; }, 5000);
  }, 1500);
});

Object.keys(validators).forEach(name => {
  const input = document.getElementById(name);
  if (input) {
    input.addEventListener('blur', () => validateField(name, input.value));
    input.addEventListener('input', () => {
      if (formErrors[name] && formErrors[name].textContent) {
        validateField(name, input.value);
      }
    });
  }
});
