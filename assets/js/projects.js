/* ============================================================
   projects.js · data/projects.json  ->  sección de proyectos
   ------------------------------------------------------------
   La landing lee los proyectos del snapshot JSON.
   Para actualizar: edita "data/projects.json", súbelo a GitHub
   y aparece solo. Sin build, sin tocar código.

   Bilingüe: cada proyecto puede traer campos paralelos con
   sufijo "_en" (role_en, description_en, category_en,
   demoLabel_en, tags_en). Si no existen, se usa el texto en ES.
   Al cambiar de idioma se re-renderiza la lista.
   ============================================================ */

(function () {
  "use strict";

  var JSON_URL = "data/projects.json";
  var DEFAULT_COLOR = "#FF8A1F";
  var CURRENT = null;   /* { list, source } — para re-render al cambiar idioma */

  function lang() {
    return (window.I18N && window.I18N.get()) || "es";
  }

  function t(key, vars) {
    if (window.I18N) return window.I18N.t(key, vars);
    return key;
  }

  function toList(v) {
    if (Array.isArray(v)) return v.map(String).map(function (s) { return s.trim(); }).filter(Boolean);
    return String(v || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function safeColor(v) {
    var c = String(v || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(c) ? c : DEFAULT_COLOR;
  }

  /* Elige el campo según el idioma activo, con vuelta al español */
  function pick(p, base) {
    if (lang() === "en") {
      var en = p[base + "_en"];
      if (en !== undefined && en !== null && String(en).trim() !== "") return en;
    }
    return p[base];
  }

  function fromJson(data) {
    var list = (data && data.projects) || [];
    return list.map(function (p, i) {
      var tagSource = pick(p, "tags");
      return {
        name: p.name || "",
        role: pick(p, "role") || "",
        description: pick(p, "description") || "",
        category: pick(p, "category") || "",
        status: p.status || "",
        year: p.year || "",
        github: p.github || "",
        demo: p.demo || "",
        demoLabel: pick(p, "demoLabel") || "",
        tags: toList(tagSource !== undefined ? tagSource : p.tags),
        featured: !!p.featured,
        color: safeColor(p.color),
        order: typeof p.order === "number" ? p.order : i
      };
    }).filter(function (p) { return p.name; });
  }

  /* ---------- Render ---------- */
  var SVG_GITHUB =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.3 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>';

  var SVG_LINK =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  /* El estado se muestra traducido pero conserva el valor original en
     data-status, para que el CSS siga pintando publicados / en desarrollo. */
  function statusLabel(status) {
    return t("proj.status." + status);
  }

  function card(p) {
    var links = "";
    if (p.demo) {
      var demoLabel = p.demoLabel || t("proj.demoFallback");
      links += '<a class="proj-btn" href="' + esc(p.demo) + '" target="_blank" rel="noopener">' + SVG_LINK + esc(demoLabel) + "</a>";
    }

    var chips = p.tags.map(function (tag) { return '<span class="chip">' + esc(tag) + "</span>"; });
    if (p.github) {
      chips.push('<a class="chip chip-link" href="' + esc(p.github) + '" target="_blank" rel="noopener">' + SVG_GITHUB + esc(t("proj.repo")) + "</a>");
    }
    var tags = chips.length
      ? '<div class="proj-tags">' + chips.join("") + "</div>"
      : "";

    var yearHtml = p.year
      ? '<span class="proj-year">' + esc(p.year) + "</span>"
      : "";
    var statusHtml = p.status
      ? '<span class="proj-status" data-status="' + esc(p.status) + '">' + esc(statusLabel(p.status)) + "</span>"
      : "";

    return '' +
      '<article class="proj' + (p.featured ? " is-featured" : "") + '" style="--pc:' + esc(p.color) + '">' +
        '<div class="proj-top">' +
          yearHtml +
          statusHtml +
          (p.category ? '<span class="proj-year">' + esc(p.category) + "</span>" : "") +
        "</div>" +
        '<h3 class="proj-name">' + esc(p.name) + "</h3>" +
        (p.role ? '<p class="proj-role">' + esc(p.role) + "</p>" : "") +
        (p.description ? '<p class="proj-desc">' + esc(p.description) + "</p>" : "") +
        tags +
        (links ? '<div class="proj-links">' + links + "</div>" : "") +
      "</article>";
  }

  function render(list, sourceLabel) {
    var host = document.getElementById("projects");
    if (!host) return;

    if (!list.length) {
      host.innerHTML = '<p class="projects-empty">' + esc(t("proj.empty")) + "</p>";
    } else {
      host.innerHTML = list.map(card).join("");
    }

    var src = document.getElementById("projectsSource");
    if (src) {
      src.innerHTML = list.length
        ? t("proj.source", { file: esc(sourceLabel), n: list.length })
        : t("proj.sourceNone", { file: esc(sourceLabel) });
    }

    document.dispatchEvent(new CustomEvent("projects:rendered", { detail: { count: list.length } }));
  }

  /* ---------- Carga ---------- */
  function loadJson() {
    return fetch(JSON_URL, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(fromJson);
  }

  function boot() {
    loadJson()
      .then(function (list) {
        CURRENT = { list: list, source: "data/projects.json" };
        render(CURRENT.list, CURRENT.source);
      })
      .catch(function () {
        CURRENT = { list: [], source: "sin datos" };
        render(CURRENT.list, CURRENT.source);
      });
  }

  /* Al cambiar de idioma, re-derivar del JSON (para reelegir *_en) y repintar */
  document.addEventListener("i18n:changed", function () {
    if (!CURRENT) return;
    loadJson().then(function (list) {
      CURRENT.list = list;
      render(CURRENT.list, CURRENT.source);
    }).catch(function () {});
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
