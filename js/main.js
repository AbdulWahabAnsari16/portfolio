/**
 * Abdul Wahab — Luxury Portfolio
 * Main JavaScript: Custom cursor, magnetic effect, GSAP scroll reveal,
 * navigation, and contact form handling.
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     PROFILE IMAGE — multi-path fallback
     ═══════════════════════════════════════ */
  const profileImg = document.getElementById('profileImg');

  if (profileImg) {
    const sources = [
      window.PROFILE_IMAGE_SRC,
      './assets/img1.png',
      './assets/img1.jpg',
      'assets/img1.png',
      'assets/img1.jpg',
    ].filter(Boolean);

    let sourceIndex = 0;

    function tryNextSource() {
      sourceIndex += 1;
      if (sourceIndex < sources.length) {
        profileImg.src = sources[sourceIndex];
      }
    }

    profileImg.addEventListener('error', tryNextSource);

    /* Prefer embedded base64 — works even when opening file directly */
    if (window.PROFILE_IMAGE_SRC) {
      profileImg.src = window.PROFILE_IMAGE_SRC;
    }
  }

  /* Subtle 3D tilt on profile frame */
  const profileFrame = document.getElementById('profileFrame');
  if (profileFrame && !('ontouchstart' in window)) {
    profileFrame.addEventListener('mousemove', (e) => {
      const rect = profileFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      profileFrame.style.transform =
        `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    profileFrame.addEventListener('mouseleave', () => {
      profileFrame.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      profileFrame.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    profileFrame.addEventListener('mouseenter', () => {
      profileFrame.style.transition = 'transform 0.1s ease';
    });
  }

  /* ─── Detect touch devices (disable custom cursor) ─── */
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.body.classList.add('has-touch-cursor');
  }

  /* ═══════════════════════════════════════
     CUSTOM CURSOR
     ═══════════════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing && !isTouchDevice) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    /* Smooth ring follow via RAF */
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Expand cursor on interactive elements */
    const interactiveSelectors =
      'a, button, .skill-tag, input, textarea, .magnetic, .nav__link';

    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        cursorRing.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        cursorRing.classList.remove('is-hovering');
      });
    });
  }

  /* ═══════════════════════════════════════
     MAGNETIC EFFECT
     ═══════════════════════════════════════ */
  const magneticElements = document.querySelectorAll('[data-magnetic]');

  if (!isTouchDevice) {
    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.25;
        const deltaY = (e.clientY - centerY) * 0.25;
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.1s ease';
      });
    });
  }

  /* ═══════════════════════════════════════
     NAVIGATION
     ═══════════════════════════════════════ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav__links');

  /* Sticky nav background on scroll */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  });

  /* Mobile menu toggle */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu on link click */
    navLinks.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
          10
        ) || 72;

        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════
     GSAP SCROLL REVEAL
     ═══════════════════════════════════════ */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Ensure hero is visible if animation is interrupted */
    gsap.set('.hero__content, .hero__visual, .profile-frame, .marquee', {
      opacity: 1,
      x: 0,
      scale: 1,
    });

    /* Hero entrance animation */
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
      .from('.hero__eyebrow', { opacity: 0, y: 20, duration: 0.8, immediateRender: false })
      .from('.hero__title-line', { opacity: 0, y: 40, duration: 0.9, stagger: 0.15, immediateRender: false }, '-=0.4')
      .from('.hero__subtitle', { opacity: 0, y: 30, duration: 0.8, immediateRender: false }, '-=0.5')
      .from('.hero__summary', { opacity: 0, y: 20, duration: 0.8, immediateRender: false }, '-=0.5')
      .from('.hero__stats', { opacity: 0, y: 20, duration: 0.7, immediateRender: false }, '-=0.4')
      .from('.hero__cta .btn-ghost', { opacity: 0, y: 20, duration: 0.7, stagger: 0.1, immediateRender: false }, '-=0.4')
      .from('.profile-frame', { opacity: 0, scale: 0.92, x: 30, duration: 1.1, immediateRender: false }, '-=0.8')
      .from('.marquee', { opacity: 0, y: 10, duration: 0.6, immediateRender: false }, '-=0.5');

    /* Section scroll reveals */
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    /* Stagger skill groups */
    gsap.from('.skill-group', {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.skills__grid',
        start: 'top 80%',
      },
    });

    /* Stagger skill tags on hover group enter */
    gsap.from('.skill-tag', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: 0.03,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.skills__grid',
        start: 'top 75%',
      },
    });
  } else {
    showAllContent();
  }

  /* Safety net if GSAP CDN is slow or blocked */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const heroTitle = document.querySelector('.hero__title');
      if (heroTitle && getComputedStyle(heroTitle).opacity === '0') {
        showAllContent();
      }
    }, 2500);
  });

  function showAllContent() {
    document.querySelectorAll('.reveal, .hero__content, .hero__visual, .profile-frame, .marquee').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('is-visible');
    });
  }

  /* ═══════════════════════════════════════
     GHOST BUTTON — Retrace border on hover
     ═══════════════════════════════════════ */
  document.querySelectorAll('.btn-ghost').forEach((btn) => {
    const rect = btn.querySelector('.btn-ghost__border rect');
    if (!rect) return;

    /* Calculate perimeter for dash animation */
    const svg = btn.querySelector('.btn-ghost__border');
    const btnRect = btn.getBoundingClientRect();
    const perimeter = (btnRect.width + btnRect.height) * 2;
    rect.style.strokeDasharray = perimeter;
    rect.style.strokeDashoffset = perimeter;

    btn.addEventListener('mouseenter', () => {
      rect.style.strokeDashoffset = '0';
    });

    btn.addEventListener('mouseleave', () => {
      rect.style.strokeDashoffset = String(perimeter);
    });
  });

  /* ═══════════════════════════════════════
     CONTACT FORM
     ═══════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        showFormStatus('Please fill in all fields.', false);
        return;
      }

      if (!isValidEmail(email)) {
        showFormStatus('Please enter a valid email address.', false);
        return;
      }

      /* Build mailto link as client-side submission */
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      const mailto = `mailto:abdulwahabb11023@gmail.com?subject=${subject}&body=${body}`;

      window.location.href = mailto;
      showFormStatus('Opening your email client…', true);
      contactForm.reset();
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormStatus(message, success) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.style.color = success ? 'var(--color-gold)' : '#c45c5c';
    formStatus.classList.add('is-visible');

    setTimeout(() => {
      formStatus.classList.remove('is-visible');
    }, 5000);
  }

  /* ═══════════════════════════════════════
     FOOTER YEAR
     ═══════════════════════════════════════ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ═══════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHT
     ═══════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  if (sections.length && navLinkEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinkEls.forEach((link) => {
              link.style.color =
                link.getAttribute('href') === `#${id}`
                  ? 'var(--color-champagne)'
                  : '';
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
