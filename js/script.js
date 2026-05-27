/* =============================================
   TERRAX LOCAÇÕES — script.js
   ============================================= */

(function () {
  'use strict';

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- LOGO FALLBACK ---- */
  // If logo images fail to load, show text logo
  const logoImgs = document.querySelectorAll('.logo-img');
  let failedCount = 0;
  logoImgs.forEach(img => {
    img.addEventListener('error', function () {
      failedCount++;
      if (failedCount >= logoImgs.length) {
        document.querySelectorAll('.logo, .footer-logo-link').forEach(logoEl => {
          logoEl.classList.add('logo-img-missing');
        });
        // Also show footer text logo
        const footerLogoText = document.querySelector('.footer-logo-text');
        if (footerLogoText) footerLogoText.style.display = 'block';
      }
    });
  });

  /* ---- CONTACT FORM (Web3Forms) ---- */
  const form = document.getElementById('orcamento-form');

  if (form) {
    const successMsg = document.getElementById('form-success');
    const errorMsg   = document.getElementById('form-error');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const submitBtn   = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg)   errorMsg.style.display   = 'none';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form)
        });
        const data = await response.json();

        if (data.success) {
          form.reset();
          if (successMsg) successMsg.style.display = 'block';
        } else {
          if (errorMsg) errorMsg.style.display = 'block';
        }
      } catch {
        if (errorMsg) errorMsg.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    // Remove error state on typing
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });
  }

  /* ---- WHATSAPP: web.whatsapp.com em desktop, api.whatsapp.com em mobile ---- */
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    document.querySelectorAll('[data-wa-mobile]').forEach(el => {
      el.href = el.dataset.waMobile;
    });
  }

  /* ---- PAGE URL FOR CAMPAIGN TRACKING (gclid, fbclid, utm_*) ---- */
  const pageUrlField = document.getElementById('page-url');
  if (pageUrlField) pageUrlField.value = window.location.href;

  /* ---- FOOTER YEAR ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- ACTIVE NAV LINK ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--yellow)';
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
