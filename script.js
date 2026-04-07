/* =====================================================
   DARSHAN P — PORTFOLIO SCRIPT
   Features: Custom Cursor, Typing, Scroll Reveal,
             Navbar, Skill Bars, Contact Form
   ===================================================== */

'use strict';

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with RAF
  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '0.6'; });
})();

/* ── NAVBAR: Scroll & Mobile Toggle ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  // Scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, { passive: true });

  // Mobile toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
})();

/* ── TYPING ANIMATION ── */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const words = [
    'MERN Stack Developer',
    'Web Developer',
    'Python Programmer',
    'Full-Stack Enthusiast',
    'Problem Solver',
  ];

  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let isPaused = false;

  const TYPING_SPEED   = 85;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 300;

  function type() {
    const currentWord = words[wordIdx];

    if (!deleting) {
      // Typing forward
      el.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentWord.length) {
        // Full word typed — pause then start deleting
        if (!isPaused) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            deleting = true;
            type();
          }, PAUSE_AFTER);
          return;
        }
      }
    } else {
      // Deleting
      el.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Kick off after a short delay
  setTimeout(type, 800);
})();

/* ── SCROLL REVEAL ANIMATION ── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
  );

  if (!revealEls.length) return;

  // Use IntersectionObserver for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Only animate once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ── SKILL BARS ANIMATION ── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar    = entry.target;
        const width  = bar.getAttribute('data-width') || '0';
        // Small delay so reveal animation plays first
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 300);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ── CONTACT FORM ── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate send (frontend only — no backend)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      if (success) {
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 5000);
      }
    }, 1200);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

/* ── SMOOTH SCROLL FOR CTA BUTTONS ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── PARALLAX HERO BACKGROUND TEXT ── */
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    bgText.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
  }, { passive: true });
})();

/* ── STAT COUNTER ANIMATION ── */
(function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const end = el.textContent.trim();

        // Only animate numeric values
        const numMatch = end.match(/^\d+/);
        if (!numMatch) return;

        const target = parseInt(numMatch[0], 10);
        const suffix = end.replace(/^\d+/, '');

        let current = 0;
        const step  = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 35);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ── PROJECT CARD TILT (subtle) ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = (y / rect.height) * 5;
      const tiltY  = -(x / rect.width)  * 5;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
})();

/* ── PAGE LOAD: Trigger hero animations ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade').forEach(el => {
    el.classList.add('revealed');
  });
});
