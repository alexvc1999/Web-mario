/* Efectos visuales suaves: reveal, header blur, parallax y profundidad */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-ready');

  // Modo claro/oscuro global. Si una pagina antigua no tiene boton, lo creamos.
  var headerActions = document.querySelector('.header-actions');
  var themeButton = document.getElementById('themeToggle');
  if (!themeButton && headerActions) {
    themeButton = document.createElement('button');
    themeButton.className = 'theme-toggle';
    themeButton.id = 'themeToggle';
    themeButton.setAttribute('aria-label', 'Cambiar modo claro/oscuro');
    themeButton.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    headerActions.insertBefore(themeButton, headerActions.firstChild);
  }

  function setHeroVideo(theme) {
    var video = document.getElementById('heroVideo');
    if (!video) return;
    var source = video.querySelector('source');
    if (!source) return;
    var nextSrc = theme === 'dark' ? 'fotos web/IMG_0547.mov' : 'fotos web/IMG_0549.mov';
    if (source.getAttribute('src') !== nextSrc) {
      source.setAttribute('src', nextSrc);
      source.setAttribute('type', 'video/quicktime');
      video.load();
      var playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tripiana-theme', theme);
    setHeroVideo(theme);
  }

  var savedTheme = localStorage.getItem('tripiana-theme') || 'light';
  applyTheme(savedTheme);
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Coloca el horario del footer junto a la marca, como en las paginas nuevas.
  document.querySelectorAll('.footer-schedule').forEach(function (schedule) {
    var footer = schedule.closest('.site-footer');
    var brand = footer && footer.querySelector('.footer-brand');
    var desc = brand && brand.querySelector('.footer-brand-desc');
    if (!brand || brand.querySelector('.footer-schedule-inline')) return;
    var text = schedule.innerHTML.replace(/^Horario\s*<br\s*\/?>/i, '');
    var moved = document.createElement('div');
    moved.className = 'footer-schedule-inline';
    moved.innerHTML = '<strong>Horario</strong>' + text;
    if (desc) desc.insertAdjacentElement('afterend', moved);
    else brand.appendChild(moved);
    schedule.remove();
  });

  // 1) Header: clase 'scrolled' cuando bajamos
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 1b) Bandas alternas entre secciones de primer nivel
  var bodySections = Array.prototype.filter.call(
    document.body.children,
    function (el) { return el.tagName === 'SECTION'; }
  );
  var bandIndex = 0;
  bodySections.forEach(function (sec, i) {
    var isHero = sec.classList.contains('hero');
    // Banda alterna (saltamos el hero, que tiene su propio fondo)
    if (!isHero) {
      sec.classList.add(bandIndex % 2 === 0 ? 'sec-bg-a' : 'sec-bg-b');
      bandIndex++;
    }
  });

  // 2) Auto-marcado de elementos para reveal (sin tocar el HTML)
  var autoTargets = [
    '.intro-split .intro-left',
    '.intro-split .intro-products',
    '.why-us-grid > div',
    '.collage-split .collage-left',
    '.collage-split .collage-right',
    '.about-split > *',
    '.testimonial-section .container',
    '.reco-header',
    '.blog-header',
    '.section-title',
    '.services-copy-grid',
    '.services-feature',
    '.blog-page-grid',
    '.contact-layout',
    '.contact-panel',
    '.contact-form',
    '.cart-table-wrap',
    '.order-total',
    '.coupon-section',
    '.policy-wrap'
  ];
  autoTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('fx-reveal');
    });
  });

  // Grids que merecen stagger en sus hijos
  var staggerTargets = [
    '.intro-products',
    '.features-grid',
    '.reco-products',
    '.blog-grid-3',
    '.blog-grid-9',
    '.products-grid-3',
    '.products-grid-4',
    '.catalog-grid',
    '.team-grid',
    '.services-grid',
    '.services-copy-grid',
    '.service-mini-grid',
    '.blog-page-grid',
    '.collage-grid',
    '.contact-info-bar',
    '.contact-info-list'
  ];
  staggerTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('fx-stagger');
    });
  });

  // 3) IntersectionObserver: activar animación al entrar en viewport
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fx-reveal, .fx-stagger').forEach(function (el) {
      io.observe(el);
    });

  } else {
    // Sin IO o usuario prefiere menos animación → mostrar todo
    document.querySelectorAll('.fx-reveal, .fx-stagger').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  // 4) Parallax suave de la foto/video del hero
  var heroPhoto = document.querySelector('.hero .hero-photo');
  if (heroPhoto && heroPhoto.tagName === 'VIDEO') {
    var markVideoFailed = function () {
      if (!heroPhoto.videoWidth || !heroPhoto.videoHeight) {
        heroPhoto.closest('.hero').classList.add('hero-video-failed');
      }
    };
    heroPhoto.addEventListener('error', markVideoFailed);
    heroPhoto.addEventListener('loadedmetadata', markVideoFailed);
    heroPhoto.addEventListener('loadeddata', markVideoFailed);
    window.setTimeout(markVideoFailed, 1800);
  }

  if (heroPhoto && !reduced) {
    var ticking = false;
    var update = function () {
      var y = window.scrollY;
      // Mueve la imagen un poco más lento que el scroll
      var shift = Math.min(y * 0.25, 120);
      heroPhoto.style.setProperty('--hero-shift', shift + 'px');
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // 4b) Profundidad sutil del hero al mover el cursor en escritorio
  var hero = document.querySelector('.hero');
  if (hero && !reduced && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      var y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty('--hero-pointer-x', (x * 14).toFixed(1) + 'px');
      hero.style.setProperty('--hero-pointer-y', (y * 10).toFixed(1) + 'px');
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-pointer-x', '0px');
      hero.style.setProperty('--hero-pointer-y', '0px');
    });
  }

  // 5) Parallax muy ligero en elementos marcados .fx-parallax
  if (!reduced) {
    var parallaxEls = document.querySelectorAll('.fx-parallax');
    if (parallaxEls.length) {
      var tickingP = false;
      var updateP = function () {
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var center = rect.top + rect.height / 2;
          var diff = (window.innerHeight / 2 - center) * 0.06;
          el.style.transform = 'translate3d(0,' + diff.toFixed(1) + 'px,0)';
        });
        tickingP = false;
      };
      window.addEventListener('scroll', function () {
        if (!tickingP) {
          window.requestAnimationFrame(updateP);
          tickingP = true;
        }
      }, { passive: true });
      updateP();
    }
  }

  // 6) Tilt de producto y piezas interactivas. Sin dependencias y con fallback limpio.
  var depthEls = document.querySelectorAll(
    '.product-card, .reco-card, .catalog-card, .blog-card, .blog-page-card, .team-card, .intro-prod-item, .service-mini-card, .contact-info-item, .contact-schedule-box, .order-total'
  );
  depthEls.forEach(function (el) {
    el.classList.add('fx-depth');
  });

  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    depthEls.forEach(function (el) {
      el.addEventListener('pointermove', function (event) {
        var rect = el.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--tilt-x', (-y * 5).toFixed(2) + 'deg');
        el.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
        el.style.setProperty('--shine-x', Math.round((x + 0.5) * 100) + '%');
        el.style.setProperty('--shine-y', Math.round((y + 0.5) * 100) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
})();
