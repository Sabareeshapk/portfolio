
  // Photo upload handler
//   document.getElementById('photoInput').addEventListener('change', function(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = function(ev) {
//       const img = document.getElementById('uploadedPhoto');
//       const ph  = document.getElementById('photoPlaceholder');
//       img.src = ev.target.result;
//       img.style.display = 'block';
//       ph.style.display  = 'none';
//     };
//     reader.readAsDataURL(file);
//   });

  // Resume guard (remove once PDF is placed)
  ['viewResumeBtn','downloadResumeBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', function(e) {
      if (this.getAttribute('href') === 'SabareeshAPKResume.pdf') {
        // If file exists it will just open — no alert needed
        // Remove this entire guard block once your PDF is in the same folder
      }
    });
  });


/* ============================================================
   PORTFOLIO — script.js
   Features: Custom cursor, Navbar scroll/active, Mobile menu,
             Dark/Light toggle, Typing effect, Scroll reveal,
             Skill bar animation, Form validation, Back to top
   ============================================================ */

'use strict';

/* ── HELPERS ── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ══════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════ */
(function initCursor() {
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .project-card, .skill-group, .social-icon, .contact-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovered');
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();


/* ══════════════════════════════════════════════
   2. NAVBAR — Scroll State + Active Links
══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar   = qs('#navbar');
  const navLinks = qsa('.nav-link');
  const sections = qsa('section[id]');

  // Scroll class
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ══════════════════════════════════════════════
   3. HAMBURGER MENU
══════════════════════════════════════════════ */
(function initHamburger() {
  const hamburger    = qs('#hamburger');
  const overlay      = qs('#mobileOverlay');
  const mobileLinks  = qsa('.mob-link');

  if (!hamburger || !overlay) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('open');
    toggleMenu(!isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) toggleMenu(false);
  });
})();


/* ══════════════════════════════════════════════
   4. DARK / LIGHT THEME TOGGLE
══════════════════════════════════════════════ */
(function initTheme() {
  const toggleBtn = qs('#themeToggle');
  const themeIcon = qs('#themeIcon');
  const html      = document.documentElement;

  if (!toggleBtn) return;

  // Read saved preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark'
        ? 'fa-solid fa-sun'
        : 'fa-solid fa-moon';
    }
  }
})();


/* ══════════════════════════════════════════════
   5. TYPING EFFECT (Hero)
══════════════════════════════════════════════ */
(function initTyping() {
  const el = qs('#typingText');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'React.js Developer',
    'Django & REST API Builder',
    'React Native Engineer',
    'Problem Solver 🚀',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; type(); }, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  type();
})();


/* ══════════════════════════════════════════════
   6. SMOOTH SCROLL for anchor links
══════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ══════════════════════════════════════════════
   7. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════════════ */
(function initScrollReveal() {
  const revealEls = qsa('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   8. SKILL BAR ANIMATION
══════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = qsa('.sb-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width') + '%';
        // Small delay for stagger effect
        setTimeout(() => { bar.style.width = width; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ══════════════════════════════════════════════
   9. CONTACT FORM VALIDATION
══════════════════════════════════════════════ */
(function initContactForm() {
  const form       = qs('#contactForm');
  if (!form) return;

  const nameInput  = qs('#name');
  const emailInput = qs('#email');
  const msgInput   = qs('#message');
  const submitBtn  = qs('#submitBtn');
  const submitText = qs('#submitText');
  const submitIcon = qs('#submitIcon');
  const successMsg = qs('#formSuccess');

  function showError(inputId, msg) {
    const errEl = qs('#' + inputId + 'Error');
    const input = qs('#' + inputId);
    if (errEl) errEl.textContent = msg;
    if (input) input.classList.add('error');
  }

  function clearError(inputId) {
    const errEl = qs('#' + inputId + 'Error');
    const input = qs('#' + inputId);
    if (errEl) errEl.textContent = '';
    if (input) input.classList.remove('error');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live validation
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) clearError('name');
  });
  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value.trim())) clearError('email');
  });
  msgInput.addEventListener('input', () => {
    if (msgInput.value.trim().length >= 10) clearError('message');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Validate name
    if (nameInput.value.trim().length < 2) {
      showError('name', 'Please enter your full name.');
      valid = false;
    } else {
      clearError('name');
    }

    // Validate email
    if (!isValidEmail(emailInput.value.trim())) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email');
    }

    // Validate message
    if (msgInput.value.trim().length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError('message');
    }

    if (!valid) return;

    // Simulate sending (replace with real API call e.g. EmailJS / Formspree)
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    submitIcon.className = 'fa-solid fa-circle-notch fa-spin';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
      submitIcon.className = 'fa-solid fa-paper-plane';
      form.reset();
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 1800);

    /*
    ── HOW TO CONNECT TO A REAL EMAIL SERVICE ──
    Option A: Formspree (easiest, no backend)
      1. Go to https://formspree.io and create a free account.
      2. Get your form endpoint (e.g. https://formspree.io/f/xabc1234).
      3. Replace the setTimeout block above with:

      fetch('https://formspree.io/f/xabc1234', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          message: msgInput.value,
        })
      })
      .then(res => res.ok ? showSuccess() : showError())
      .catch(showError);

    Option B: EmailJS (client-side email service)
      See: https://www.emailjs.com/docs/
    */
  });
})();


/* ══════════════════════════════════════════════
   10. BACK TO TOP BUTTON
══════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ══════════════════════════════════════════════
   11. FOOTER — Dynamic Year
══════════════════════════════════════════════ */
(function initYear() {
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ══════════════════════════════════════════════
   12. RESUME BUTTON GUARD
   (Warns if resume PDF not yet uploaded)
══════════════════════════════════════════════ */
(function initResumeGuard() {
  const viewBtn     = qs('#viewResumeBtn');
  const downloadBtn = qs('#downloadResumeBtn');

  function guard(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href === 'your-resume.pdf') {
      e.preventDefault();
      alert('Resume PDF not yet uploaded. Replace "your-resume.pdf" with your actual file path in index.html.');
    }
  }

  if (viewBtn)     viewBtn.addEventListener('click', guard);
  if (downloadBtn) downloadBtn.addEventListener('click', guard);
})();


/* ══════════════════════════════════════════════
   13. SCROLL PROGRESS BAR (top of page)
══════════════════════════════════════════════ */
(function initScrollProgress() {
  // Create element
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '3px',
    width: '0%',
    background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)',
    zIndex: '10000',
    transition: 'width 0.1s linear',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const doc   = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct   = (window.scrollY / total) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


/* ══════════════════════════════════════════════
   14. PROJECT CARD TILT EFFECT (desktop only)
══════════════════════════════════════════════ */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  qsa('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 6;
      const tiltY  = ((cx - x) / cx) * 6;

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   15. STAGGER DELAY on grid children
══════════════════════════════════════════════ */
(function initStagger() {
  const grids = ['.skills-categories', '.projects-grid', '.certs-grid', '.edu-grid'];
  grids.forEach(sel => {
    const grid = qs(sel);
    if (!grid) return;
    qsa('.reveal-up', grid).forEach((el, i) => {
      el.style.setProperty('--d', (i * 0.1) + 's');
    });
  });
})();
