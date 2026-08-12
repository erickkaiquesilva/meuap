/* ============================================================
   CHAVE — DESIGN SYSTEM
   Script único com os comportamentos de interface do protótipo
   (abas, chips, favoritar, modal, popover, reveal-on-scroll).
   Baseado em seletores por classe/atributo, então funciona em
   qualquer página do projeto que reutilize os mesmos componentes
   sem precisar de JS adicional por página.

   Uso:
     <script src="/assets/js/main.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Grupos de alternância (abas de busca, chips de categoria)
     Qualquer conjunto de elementos que compartilhe o mesmo
     seletor se comporta como um grupo de seleção única.
  --------------------------------------------------------- */
  function initToggleGroup(itemSelector) {
    var items = document.querySelectorAll(itemSelector);
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        items.forEach(function (el) { el.classList.remove('active'); });
        item.classList.add('active');
      });
    });
  }

  initToggleGroup('.search-tab');
  initToggleGroup('.cat-row .chip');

  /* ---------------------------------------------------------
     Favoritar (botão de coração com feedback elástico)
  --------------------------------------------------------- */
  function bindFavoriteToggle(el) {
    el.addEventListener('click', function () {
      el.classList.toggle('liked');
      el.classList.remove('pop-anim');
      void el.offsetWidth; // reinicia a animação em cliques consecutivos
      el.classList.add('pop-anim');
    });
  }

  document.querySelectorAll('.fav-btn').forEach(bindFavoriteToggle);

  var heartDemo = document.getElementById('heartDemo');
  if (heartDemo) bindFavoriteToggle(heartDemo);

  /* ---------------------------------------------------------
     Modais
     Abrir:  adicione data-modal-open="ID_DO_OVERLAY" ao gatilho.
     Fechar: classe .modal-close ou atributo data-modal-close em
             qualquer elemento dentro do overlay, clique fora do
             .modal ou tecla Esc.
  --------------------------------------------------------- */
  (function initModals() {
    var overlays = document.querySelectorAll('.modal-overlay');
    if (!overlays.length) return;

    function open(overlay) {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close(overlay) {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      var overlay = document.getElementById(trigger.getAttribute('data-modal-open'));
      if (!overlay) return;
      trigger.addEventListener('click', function () { open(overlay); });
    });

    overlays.forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close(overlay);
      });
      overlay.querySelectorAll('.modal-close, [data-modal-close]').forEach(function (btn) {
        btn.addEventListener('click', function () { close(overlay); });
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      overlays.forEach(function (overlay) {
        if (overlay.classList.contains('is-open')) close(overlay);
      });
    });
  })();

  /* ---------------------------------------------------------
     Popovers acionados por clique.
     A variação `.pop-hover` é resolvida só em CSS (hover/focus)
     e é ignorada aqui.
  --------------------------------------------------------- */
  (function initPopovers() {
    var wraps = document.querySelectorAll('.popover-wrap:not(.pop-hover)');
    if (!wraps.length) return;

    function getTrigger(wrap) {
      return wrap.querySelector(':scope > :not(.popover)');
    }

    wraps.forEach(function (wrap) {
      var trigger = getTrigger(wrap);
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        wrap.classList.toggle('is-open');
        trigger.classList.toggle('active', wrap.classList.contains('is-open'));
      });
    });

    document.addEventListener('click', function (e) {
      wraps.forEach(function (wrap) {
        if (wrap.contains(e.target)) return;
        wrap.classList.remove('is-open');
        var trigger = getTrigger(wrap);
        if (trigger) trigger.classList.remove('active');
      });
    });
  })();

  /* ---------------------------------------------------------
     Reveal on scroll — entrada suave de elementos `.reveal-box`
     conforme entram na viewport. Opcional: um botão com id
     `replayReveal` reinicia a animação (usado na página de docs).
  --------------------------------------------------------- */
  (function initRevealOnScroll() {
    var boxes = document.querySelectorAll('.reveal-box');
    if (!boxes.length) return;
    var replayBtn = document.getElementById('replayReveal');

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      }, { threshold: 0.4 });
      boxes.forEach(function (box) { io.observe(box); });
    } else {
      boxes.forEach(function (box) { box.classList.add('is-visible'); });
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', function () {
        boxes.forEach(function (box) { box.classList.remove('is-visible'); });
        window.requestAnimationFrame(function () {
          setTimeout(function () {
            boxes.forEach(function (box) { box.classList.add('is-visible'); });
          }, 60);
        });
      });
    }
  })();
})();
