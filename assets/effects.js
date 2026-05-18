/* Efectos visuales suaves: reveal, header blur, parallax y profundidad */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-ready');

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

  // 1b) Separadores florales + bandas alternas entre secciones de primer nivel
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
    // Divisor: insertar antes de cada section menos la primera y menos justo después del hero
    var prev = sec.previousElementSibling;
    if (prev && prev.tagName === 'SECTION' && !sec.classList.contains('hero')) {
      var divider = document.createElement('div');
      divider.className = 'section-divider';
      divider.innerHTML = '<span class="section-divider-mark" aria-hidden="true"></span>';
      sec.parentNode.insertBefore(divider, sec);
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

    // Activar rotación de la flor del divisor cuando entra en pantalla
    var dividerIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          dividerIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.section-divider').forEach(function (el) {
      dividerIo.observe(el);
    });
  } else {
    // Sin IO o usuario prefiere menos animación → mostrar todo
    document.querySelectorAll('.fx-reveal, .fx-stagger').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  // 4) Parallax suave de la foto del hero
  var heroPhoto = document.querySelector('.hero .hero-photo');
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
