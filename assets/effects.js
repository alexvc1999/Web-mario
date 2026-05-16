/* Efectos visuales suaves: reveal, header blur, parallax hero */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    '.contact-form',
    '.cart-table-wrap',
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
    '.collage-grid',
    '.contact-info-bar'
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
})();
