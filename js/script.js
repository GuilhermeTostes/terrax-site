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

  /* ---- MOBILE MENU ---- */
  const toggle   = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('nav-menu-mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

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

  /* ---- CONTACT FORM ---- */
  const form = document.getElementById('orcamento-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(field => {
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

      // Build WhatsApp message
      const nome       = document.getElementById('nome').value.trim();
      const empresa    = document.getElementById('empresa').value.trim();
      const telefone   = document.getElementById('telefone').value.trim();
      const email      = document.getElementById('email').value.trim();
      const equip      = document.getElementById('equipamento').value;
      const mensagem   = document.getElementById('mensagem').value.trim();

      let msg = `Olá! Gostaria de solicitar um orçamento pela TerraX Locações.\n\n`;
      msg += `*Nome:* ${nome}\n`;
      if (empresa) msg += `*Empresa:* ${empresa}\n`;
      msg += `*Telefone:* ${telefone}\n`;
      if (email)   msg += `*E-mail:* ${email}\n`;
      if (equip)   msg += `*Equipamento:* ${equip}\n`;
      msg += `*Mensagem:* ${mensagem}`;

      const url = `https://wa.me/5581996992424?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    // Remove error class on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });
  }

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
