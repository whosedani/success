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
    // CA display — full, no truncation
    if (CONFIG.ca) {
      var cas = document.querySelectorAll('#headerCa, #heroCa');
      cas.forEach(function (el) {
        el.textContent = CONFIG.ca;
        el.title = CONFIG.ca;
      });
    }

    // Links
    document.querySelectorAll('#twitterLink, #heroTwitterLink').forEach(function (el) {
      if (CONFIG.twitter) el.href = CONFIG.twitter;
    });
  }

  // ── Copy CA ──
  function initCopy() {
    document.querySelectorAll('#headerCa, #heroCa').forEach(function (el) {
      el.addEventListener('click', copyCA);
    });
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

  // ── Tweet iframe auto-resize ──
  function initTweetResize() {
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://platform.twitter.com') return;
      try {
        var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data['twttr.embed'] && data['twttr.embed'].method === 'twttr.private.resize') {
          var params = data['twttr.embed'].params;
          if (params && params.length > 0) {
            var frame = document.getElementById('tweetFrame');
            if (frame) frame.style.height = params[0].height + 'px';
          }
        }
      } catch (ex) {}
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initScrollReveal();
    initHeader();
    initCopy();
    initScrollHint();
    initTweetResize();
  });
})();
