/* ============================================================
   projects.js — Proyectos.xlsx  ->  sección de proyectos
   ------------------------------------------------------------
   La landing lee DIRECTAMENTE el Excel con SheetJS. Agregas una
   fila en "Proyectos.xlsx", subes el archivo a GitHub y aparece
   sola. Sin build, sin tocar código.

   Si el navegador no puede leer el .xlsx (p. ej. abriste el
   index.html con doble clic en file://), cae al snapshot
   data/projects.json generado por  python tools/xlsx_to_json.py
   ============================================================ */

(function () {
  "use strict";

  var XLSX_URL = "Proyectos.xlsx";
  var JSON_URL = "data/projects.json";
  var DEFAULT_COLOR = "#FF8A1F";
  var TRUTHY = ["si", "sí", "yes", "true", "1", "x", "verdadero", "destacado"];

  var FIELDS = {
    proyecto: "name", nombre: "name",
    rol: "role",
    descripcion: "description", descripción: "description",
    categoria: "category", categoría: "category",
    estado: "status",
    año: "year", ano: "year",
    "link github": "github", github: "github", repositorio: "github", repo: "github",
    "link demo": "demo", demo: "demo", link: "demo", web: "demo", itch: "demo",
    "texto demo": "demoLabel", "texto boton demo": "demoLabel", "boton demo": "demoLabel",
    tags: "tags", tecnologias: "tags", tecnologías: "tags", etiquetas: "tags",
    destacado: "featured",
    color: "color",
    orden: "order", order: "order"
  };

  var BLANK = {
    name: "", role: "", description: "", category: "", status: "",
    year: "", github: "", demo: "", demoLabel: "", tags: "",
    featured: "", color: "", order: ""
  };

  function norm(v) {
    return String(v == null ? "" : v)
      .trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function isTruthy(v) { return TRUTHY.indexOf(norm(v)) !== -1; }

  function toList(v) {
    if (Array.isArray(v)) return v.map(String).map(function (s) { return s.trim(); }).filter(Boolean);
    return String(v || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function safeColor(v) {
    var c = String(v || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(c) ? c : DEFAULT_COLOR;
  }

  /** Convierte una matriz (filas x columnas) en objetos de proyecto. */
  function fromMatrix(matrix) {
    if (!matrix || matrix.length < 2) return [];

    var header = matrix[0].map(function (raw) {
      return FIELDS[norm(raw)] || norm(raw);
    });

    var out = [];
    for (var r = 1; r < matrix.length; r++) {
      var row = matrix[r] || [];

      // Primera fila totalmente vacía = fin de la tabla
      if (row.every(function (c) { return String(c == null ? "" : c).trim() === ""; })) break;

      var item = {};
      for (var k in BLANK) item[k] = "";

      for (var c = 0; c < header.length; c++) {
        if (header[c] in item) item[header[c]] = row[c] == null ? "" : String(row[c]).trim();
      }

      if (!item.name) continue;

      out.push({
        name: item.name,
        role: item.role,
        description: item.description,
        category: item.category,
        status: item.status || "—",
        year: item.year || "—",
        github: item.github,
        demo: item.demo,
        demoLabel: item.demoLabel,
        tags: toList(item.tags),
        featured: isTruthy(item.featured),
        color: safeColor(item.color),
        order: parseFloat(item.order) || 999
      });
    }

    return out.sort(function (a, b) {
      return a.order - b.order || a.name.localeCompare(b.name);
    });
  }

  function fromJson(data) {
    var list = (data && data.projects) || [];
    return list.map(function (p, i) {
      return {
        name: p.name || "",
        role: p.role || "",
        description: p.description || "",
        category: p.category || "",
        status: p.status || "—",
        year: p.year || "—",
        github: p.github || "",
        demo: p.demo || "",
        demoLabel: p.demoLabel || "",
        tags: toList(p.tags),
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

  function card(p) {
    var links = "";
    if (p.github) {
      links += '<a class="proj-btn" href="' + esc(p.github) + '" target="_blank" rel="noopener">' + SVG_GITHUB + 'Repositorio</a>';
    }
    if (p.demo) {
      var demoLabel = p.demoLabel || "Ver / jugar";
      links += '<a class="proj-btn" href="' + esc(p.demo) + '" target="_blank" rel="noopener">' + SVG_LINK + esc(demoLabel) + "</a>";
    }
    if (!links) {
      links = '<p class="proj-pending">Enlaces pendientes: agrégalos en Proyectos.xlsx</p>';
    }

    var tags = p.tags.length
      ? '<div class="proj-tags">' + p.tags.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>"
      : "";

    return '' +
      '<article class="proj' + (p.featured ? " is-featured" : "") + '" style="--pc:' + esc(p.color) + '">' +
        '<div class="proj-top">' +
          '<span class="proj-year">' + esc(p.year) + "</span>" +
          '<span class="proj-status" data-status="' + esc(p.status) + '">' + esc(p.status) + "</span>" +
          (p.category ? '<span class="proj-year">' + esc(p.category) + "</span>" : "") +
        "</div>" +
        '<h3 class="proj-name">' + esc(p.name) + "</h3>" +
        (p.role ? '<p class="proj-role">' + esc(p.role) + "</p>" : "") +
        (p.description ? '<p class="proj-desc">' + esc(p.description) + "</p>" : "") +
        tags +
        '<div class="proj-links">' + links + "</div>" +
      "</article>";
  }

  function render(list, sourceLabel) {
    var host = document.getElementById("projects");
    if (!host) return;

    if (!list.length) {
      host.innerHTML = '<p class="projects-empty">Aún no hay proyectos. Agrega una fila en Proyectos.xlsx.</p>';
    } else {
      host.innerHTML = list.map(card).join("");
    }

    var src = document.getElementById("projectsSource");
    if (src) src.innerHTML = "Fuente: <code>" + esc(sourceLabel) + "</code> · " + list.length + " proyecto(s)";

    document.dispatchEvent(new CustomEvent("projects:rendered", { detail: { count: list.length } }));
  }

  /* ---------- Carga ---------- */
  function loadXlsx() {
    if (typeof XLSX === "undefined") return Promise.reject(new Error("SheetJS no disponible"));
    return fetch(XLSX_URL).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.arrayBuffer();
    }).then(function (buf) {
      var wb = XLSX.read(new Uint8Array(buf), { type: "array" });
      var ws = wb.Sheets[wb.SheetNames[0]];
      var matrix = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "" });
      var list = fromMatrix(matrix);
      if (!list.length) throw new Error("Excel sin filas válidas");
      return list;
    });
  }

  function loadJson() {
    return fetch(JSON_URL).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(fromJson);
  }

  function boot() {
    loadXlsx()
      .then(function (list) { render(list, "Proyectos.xlsx"); })
      .catch(function () {
        loadJson()
          .then(function (list) { render(list, "data/projects.json"); })
          .catch(function () {
            render([], "sin datos — ejecuta: python tools/xlsx_to_json.py");
          });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
