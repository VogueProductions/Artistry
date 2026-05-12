// ============================================================
// ARTISTRY UNISEX SALON — AGRA
// main.js — Navigation, Tabs, Before/After, Animations
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ─── NAVIGATION SCROLL ───
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ─── MOBILE HAMBURGER ───
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ─── SERVICE TABS ───
  const tabs = document.querySelectorAll('.stab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      const el = document.getElementById('tab-' + target);
      if (el) el.style.display = 'grid';
    });
  });

  // ─── BEFORE/AFTER SLIDER ───
  function initSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const handle = slider.querySelector('.ba-handle');
    const before = slider.querySelector('.ba-before');
    let dragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      handle.style.left = pct + '%';
      before.style.width = pct + '%';
    }

    handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    handle.addEventListener('touchstart', e => { dragging = true; }, { passive: true });

    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('touchend', () => { dragging = false; });

    // Click anywhere on slider
    slider.addEventListener('click', e => {
      if (!dragging) setPosition(e.clientX);
    });
  }

  initSlider('slider1');
  initSlider('slider2');
  initSlider('slider3');

  // ─── SCROLL ANIMATIONS ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

  // ─── BOOKING SLOT SELECTION (index page) ───
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', function () {
      if (this.classList.contains('booked')) return;
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── ADD FADE-UP TO KEY SECTIONS ───
  document.querySelectorAll('.scard, .tcard, .astat, .transform-card').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
});
