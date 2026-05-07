// =============================================================
// Arthur Cotier — portfolio
// app.js : interactions partagées (nav, scroll, reveal, curseur, transitions)
// =============================================================

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------
  // 1. Nav : blur au scroll + menu mobile
  // ----------------------------------------------------------
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScrolled = false;
    const onScroll = () => {
      const isScrolled = window.scrollY > 12;
      if (isScrolled !== lastScrolled) {
        header.classList.toggle('is-scrolled', isScrolled);
        lastScrolled = isScrolled;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('no-scroll', open);
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ----------------------------------------------------------
  // 2. Reveal au scroll (IntersectionObserver)
  // ----------------------------------------------------------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // ----------------------------------------------------------
  // 3. Curseur custom (desktop, non-touch, motion ok)
  // ----------------------------------------------------------
  const isTouch = window.matchMedia('(hover: none)').matches;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  if (!isTouch && !isMobile && !reduceMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    let mx = 0, my = 0, cx = 0, cy = 0;
    let active = false;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!active) {
        active = true;
        cursor.classList.add('is-active');
      }
    };
    const onLeave = () => {
      active = false;
      cursor.classList.remove('is-active');
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    // Hover sur éléments interactifs : grossit
    const hoverSelector = 'a, button, [role="button"], input, textarea, select';
    document.querySelectorAll(hoverSelector).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    // Anim avec lerp pour douceur
    const tick = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ----------------------------------------------------------
  // 4. Transitions de page (fade simple)
  // ----------------------------------------------------------
  if (!reduceMotion) {
    const fade = document.createElement('div');
    fade.className = 'page-fade';
    fade.setAttribute('aria-hidden', 'true');
    document.body.appendChild(fade);

    // Au chargement : déjà invisible (par défaut). On pourrait jouer un fade-in si on voulait.

    // Sur clic sur lien interne .html : fade puis nav
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      // Internes uniquement (.html ou /)
      const isInternal =
        (href.endsWith('.html') || href === '/' || href === './') &&
        !link.target &&
        !link.hasAttribute('download');
      if (!isInternal) return;
      link.addEventListener('click', (e) => {
        // Si Cmd/Ctrl, on laisse le navigateur ouvrir un onglet
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        fade.classList.add('is-active');
        setTimeout(() => { window.location.href = href; }, 280);
      });
    });
  }

  // ----------------------------------------------------------
  // 5. Année dynamique en footer
  // ----------------------------------------------------------
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ----------------------------------------------------------
  // 6. Mailto pré-rempli si formulaire de contact
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contact-quick-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]')?.value.trim() || '';
      const subject = contactForm.querySelector('[name="subject"]')?.value.trim() || 'Demande';
      const message = contactForm.querySelector('[name="message"]')?.value.trim() || '';
      const body = encodeURIComponent(
        `${message}\n\n— ${name}`
      );
      const subj = encodeURIComponent(`[Site] ${subject}`);
      window.location.href = `mailto:arthur.cotier2@gmail.com?subject=${subj}&body=${body}`;
    });
  }
})();
