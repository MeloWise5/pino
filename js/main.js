/* ============================================================
   Pino Landscaping – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll state ---- */
  const nav = document.querySelector('.site-nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger
      const bars = toggle.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      }
    });

    /* Close nav when a link is clicked */
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        const bars = toggle.querySelectorAll('span');
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      });
    });
  }

  /* ---- Highlight active nav link ---- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Reveal on scroll (Intersection Observer) ---- */
  const revealEls = document.querySelectorAll(
    '.process-step, .portfolio-card, .service-card, .testimonial-card, ' +
    '.mission__text, .mission__visual, .stat-item'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el, i) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(28px)';
      el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
      observer.observe(el);
    });
  }

  /* Add 'revealed' CSS rule dynamically */
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);

  /* ---- Counter animation for stats bar ---- */
  function animateCounter(el) {
    const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
    const suffix = el.textContent.replace(/[\d]/g, '');
    if (isNaN(target)) return;
    let current = 0;
    const duration = 1400;
    const frameCount = 60;
    const increment = Math.ceil(target / frameCount);
    const interval = Math.round(duration / frameCount);
    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, interval);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          statsBar.querySelectorAll('.stat-item__num').forEach(animateCounter);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsBar);
  }

  /* ---- Portfolio filter (portfolio.html) ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-full-grid .portfolio-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---- Contact form (contact.html) ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#52b788';
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* ---- Smooth hero bg on load ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    heroBg.style.transform = 'scale(1)';
  }

})();
