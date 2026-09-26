/* ============================================================
   lang.js · Dropdown de idiomas (ES por defecto · EN)
   ------------------------------------------------------------
   Combo accesible sin dependencias: <button role="combobox"> +
   <ul role="listbox"> con dos opciones. Sigue el sistema IGNIS:
   píldora, sin cajas duras, con glow y hairline.
   Coordina con i18n.js a través de window.I18N.
   ============================================================ */

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var root = document.getElementById("lang");
    var btn = document.getElementById("langBtn");
    var list = document.getElementById("langList");
    var label = document.getElementById("langLabel");
    if (!root || !btn || !list || !label) return;

    var opts = Array.prototype.slice.call(list.querySelectorAll("[data-lang-opt]"));
    var open = false;

    function paint() {
      var cur = window.I18N ? window.I18N.get() : "es";
      label.textContent = cur.toUpperCase();
      opts.forEach(function (o) {
        var on = o.getAttribute("data-lang-opt") === cur;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    function isOpen() { return open; }

    function show() {
      if (open) return;
      open = true;
      list.hidden = false;
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      requestAnimationFrame(function () { list.classList.add("open"); });
      var active = list.querySelector('[aria-selected="true"]') || opts[0];
      if (active) active.focus({ preventScroll: true });
    }

    function hide(focusBtn) {
      if (!open) return;
      open = false;
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      list.classList.remove("open");
      setTimeout(function () { if (!open) list.hidden = true; }, 200);
      if (focusBtn) btn.focus();
    }

    function choose(lang) {
      if (window.I18N) window.I18N.set(lang);
      paint();
      hide(true);
      var live = document.getElementById("toast");
      if (live && window.I18N) {
        live.textContent = window.I18N.t("a11y.langLabel") + ": " + window.I18N.t("lang." + lang);
        live.classList.add("show");
        setTimeout(function () { live.classList.remove("show"); }, 2200);
      }
    }

    /* --- Ratón / táctil --- */
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      isOpen() ? hide(true) : show();
    });

    opts.forEach(function (o) {
      o.addEventListener("click", function (e) {
        e.stopPropagation();
        choose(o.getAttribute("data-lang-opt"));
      });
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) hide(false);
    });

    /* --- Teclado --- */
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        if (!isOpen()) { e.preventDefault(); show(); }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen()) show();
        var last = opts[opts.length - 1];
        if (last) last.focus();
      }
    });

    list.addEventListener("keydown", function (e) {
      var i = opts.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        opts[Math.min(i + 1, opts.length - 1)].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        opts[Math.max(i - 1, 0)].focus();
      } else if (e.key === "Home") {
        e.preventDefault(); opts[0].focus();
      } else if (e.key === "End") {
        e.preventDefault(); opts[opts.length - 1].focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (i > -1) choose(opts[i].getAttribute("data-lang-opt"));
      } else if (e.key === "Escape") {
        e.preventDefault(); hide(true);
      } else if (e.key === "Tab") {
        hide(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) hide(true);
    });

    /* Si i18n cambia por otra vía (?lang=, API), reflejarlo */
    document.addEventListener("i18n:changed", paint);
    document.addEventListener("i18n:ready", paint);

    paint();
  });
})();
