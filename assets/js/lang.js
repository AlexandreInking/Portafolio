/* ============================================================
   lang.js · Dropdown de idiomas (ES por defecto · EN)
   ------------------------------------------------------------
   Combo accesible sin dependencias: <button role="combobox"> +
   <ul role="listbox"> con dos opciones. Sigue el sistema IGNIS:
   píldora, sin cajas duras, con glow y hairline.

   Hay dos instancias en el DOM —la de la barra superior y la que
   vive dentro del menú móvil— y ambas deben funcionar. Por eso
   todo se inicializa recorriendo `.lang` en lugar de usar los ids
   `lang` / `langBtn` / `langList`, que solo existen en la primera.

   Coordina con i18n.js a través de window.I18N.
   ============================================================ */

(function () {
  "use strict";

  var instances = [];

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  /* Repinta todas las instancias (idioma activo + etiqueta). */
  function paintAll() {
    var cur = window.I18N ? window.I18N.get() : "es";
    instances.forEach(function (inst) {
      inst.label.textContent = cur.toUpperCase();
      inst.opts.forEach(function (o) {
        var on = o.getAttribute("data-lang-opt") === cur;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
  }

  function closeAll(except) {
    instances.forEach(function (inst) {
      if (inst !== except && inst.open) inst.hide(false);
    });
  }

  function build(root) {
    var btn = root.querySelector(".lang-btn");
    var list = root.querySelector(".lang-list");
    var label = root.querySelector("#langLabel, .lang-label-menu");
    if (!btn || !list || !label) return null;

    var opts = Array.prototype.slice.call(list.querySelectorAll("[data-lang-opt]"));
    if (!opts.length) return null;

    /* Ids accesibles: la instancia de la barra ya los trae; la del
       menú móvil los necesita para que aria-controls resuelva. */
    var idx = instances.length;
    if (!btn.id) btn.id = "langBtn-" + idx;
    if (!list.id) list.id = "langList-" + idx;
    btn.setAttribute("aria-controls", list.id);
    if (!list.getAttribute("aria-labelledby")) list.setAttribute("aria-labelledby", btn.id);

    var inst = {
      root: root,
      btn: btn,
      list: list,
      label: label,
      opts: opts,
      open: false
    };

    inst.show = function () {
      if (inst.open) return;
      closeAll(inst);
      inst.open = true;
      list.hidden = false;
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      requestAnimationFrame(function () { list.classList.add("open"); });
      var active = list.querySelector('[aria-selected="true"]') || opts[0];
      if (active) active.focus({ preventScroll: true });
    };

    inst.hide = function (focusBtn) {
      if (!inst.open) return;
      inst.open = false;
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      list.classList.remove("open");
      setTimeout(function () { if (!inst.open) list.hidden = true; }, 200);
      if (focusBtn) btn.focus();
    };

    function choose(lang) {
      if (window.I18N) window.I18N.set(lang);
      paintAll();
      inst.hide(true);
      var live = document.getElementById("toast");
      if (live && window.I18N) {
        live.textContent = window.I18N.t("a11y.langLabel") + ": " + window.I18N.t("lang." + lang);
        live.classList.add("show");
        setTimeout(function () { live.classList.remove("show"); }, 2200);
      }
    }

    /* --- Ratón / táctil ---
       En el menú móvil el clic no debe cerrar el overlay: se frena
       la propagación para que main.js no interprete "cerrar menú". */
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      inst.open ? inst.hide(true) : inst.show();
    });

    opts.forEach(function (o) {
      o.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        choose(o.getAttribute("data-lang-opt"));
      });
    });

    /* --- Teclado --- */
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        if (!inst.open) { e.preventDefault(); inst.show(); }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!inst.open) inst.show();
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
        e.preventDefault(); inst.hide(true);
      } else if (e.key === "Tab") {
        inst.hide(false);
      }
    });

    instances.push(inst);
    return inst;
  }

  ready(function () {
    var roots = document.querySelectorAll(".lang");
    for (var i = 0; i < roots.length; i++) build(roots[i]);

    /* Clic fuera: cierra la instancia que no contiene el objetivo */
    document.addEventListener("click", function (e) {
      instances.forEach(function (inst) {
        if (inst.open && !inst.root.contains(e.target)) inst.hide(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll(null);
    });

    /* Si i18n cambia por otra vía (?lang=, API), reflejarlo */
    document.addEventListener("i18n:changed", paintAll);
    document.addEventListener("i18n:ready", paintAll);

    /* El idioma se puede cambiar desde cualquiera de los dos combos */
    document.addEventListener("i18n:changed", function () { closeAll(null); });

    paintAll();
  });
})();
