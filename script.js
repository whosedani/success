(function () {
  'use strict';

  const CONFIG = {
    ca: '',
    twitter: '',
    community: '',
    buy: '',
    tweet1: '',
    tweet2: ''
  };

  // ── Load config from API ──
  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      Object.assign(CONFIG, data);
      applyConfig();
    } catch (e) {
      // silently fail — site works without config
    }
  }

  function applyConfig() {
    // CA display
    const headerCa = document.getElementById('headerCa');
    if (headerCa && CONFIG.ca) {
      const short = CONFIG.ca.length > 10
        ? CONFIG.ca.slice(0, 6) + '...' + CONFIG.ca.slice(-4)
        : CONFIG.ca;
      headerCa.textContent = short;
      headerCa.title = CONFIG.ca;
    }

    // Links
    const communityLink = document.getElementById('communityLink');
    if (communityLink && CONFIG.community) {
      communityLink.href = CONFIG.community;
    }

    // Tweet images
    if (CONFIG.tweet1) {
      const img = document.getElementById('tweet1Img');
      if (img) img.src = CONFIG.tweet1;
    }
    if (CONFIG.tweet2) {
      const img = document.getElementById('tweet2Img');
      if (img) img.src = CONFIG.tweet2;
    }
  }

  // ── Copy CA ──
  function initCopy() {
    const headerCa = document.getElementById('headerCa');
    if (headerCa) {
      headerCa.addEventListener('click', copyCA);
    }
  }

  function copyCA() {
    if (!CONFIG.ca) return;
    const toast = document.getElementById('toast');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.ca).then(showToast);
    } else {
      const ta = document.createElement('textarea');
      ta.value = CONFIG.ca;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    }
  }

  function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // ── Scroll reveal ──
  function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ── Header show/hide on scroll ──
  function initHeader() {
    const header = document.getElementById('siteHeader');
    const hero = document.getElementById('hero');
    if (!header || !hero) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const heroBottom = hero.offsetHeight;
        if (window.scrollY > heroBottom) {
          header.classList.add('visible');
        } else {
          header.classList.remove('visible');
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Scroll hint hide ──
  function initScrollHint() {
    const scrollLine = document.querySelector('.scroll-line');
    const heroScroll = document.querySelector('.hero-scroll');
    if (!scrollLine) return;

    let hidden = false;
    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > 100) {
        hidden = true;
        scrollLine.style.opacity = '0';
        scrollLine.style.transition = 'opacity 0.5s ease';
        if (heroScroll) {
          heroScroll.style.opacity = '0';
          heroScroll.style.transition = 'opacity 0.5s ease';
        }
      }
    }, { passive: true });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initScrollReveal();
    initHeader();
    initCopy();
    initScrollHint();
  });
})();
