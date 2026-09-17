/* ============================================================
   main.js — Capa de animación GSAP + interacción
   Sigue las prácticas oficiales de GSAP (skills gsap-*):
   timelines en vez de delays, transform aliases, autoAlpha,
   gsap.matchMedia() para responsive y prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  var revealAll = function () {
    var els = document.querySelectorAll(
      ".hero-eyebrow,.hero-lead,.hero-actions,.hero-meta,.scroll-cue,.hero-title .ch"
    );
    for (var i = 0; i < els.length; i++) els[i].style.opacity = 1;
  };

  if (typeof gsap === "undefined") { revealAll(); return; }

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.defaults({ duration: 0.8, ease: "power3.out" });

  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduced = reduceQuery.matches;

  /* =========================================================
     1. CAMPO DE BRASAS — partículas subiendo
     ========================================================= */
  function buildEmbers() {
    var field = document.getElementById("emberField");
    if (!field) return;

    if (reduced) { field.style.display = "none"; return; }

    var count = window.innerWidth < 768 ? 14 : 30;
    var palette = ["#FFD447", "#FF8A1F", "#FF5B1F", "#E0231A", "#FFF6EC"];
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var e = document.createElement("span");
      e.className = "ember";
      var size = gsap.utils.random(2, 5, 0.5);
      e.style.width = size + "px";
      e.style.height = size + "px";
      e.style.left = gsap.utils.random(0, 100) + "%";
      e.style.background = palette[i % palette.length];
      frag.appendChild(e);
    }
    field.appendChild(frag);

    var embers = field.querySelectorAll(".ember");

    embers.forEach(function (el) {
      gsap.set(el, { y: 0, opacity: 0 });

      gsap.timeline({ repeat: -1, delay: gsap.utils.random(0, 6) })
        .to(el, {
          opacity: gsap.utils.random(0.25, 0.75),
          duration: gsap.utils.random(1, 2.4),
          ease: "sine.inOut"
        })
        .to(el, {
          y: -window.innerHeight * gsap.utils.random(0.7, 1.15),
          x: gsap.utils.random(-70, 70),
          duration: gsap.utils.random(7, 15),
          ease: "none"
        }, 0)
        .to(el, {
          opacity: 0,
          duration: gsap.utils.random(1.5, 3),
          ease: "sine.in"
        }, "-=3");

      // Vaivén lateral
      gsap.to(el, {
        x: "+=" + gsap.utils.random(-26, 26),
        duration: gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  /* =========================================================
     2. GEOMETRÍA MEMPHIS — deriva infinita + parallax
     ========================================================= */
  function memphisMotion() {
    var shapes = gsap.utils.toArray(".mm");
    if (!shapes.length || reduced) return;

    shapes.forEach(function (el, i) {
      var depth = 0.06 + (i % 4) * 0.05;

      gsap.to(el, {
        y: gsap.utils.random(-34, 34),
        x: gsap.utils.random(-22, 22),
        rotation: gsap.utils.random(-16, 16),
        duration: gsap.utils.random(7, 13),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.18
      });

      // Parallax al hacer scroll (transform, no layout)
      gsap.to(el, {
        yPercent: -120 * depth * 3,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2
        }
      });
    });
  }

  /* =========================================================
     3. HERO — intro
     ========================================================= */
  function heroIntro() {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    var chs = gsap.utils.toArray(".hero-title .ch");

    if (typeof SplitText !== "undefined" && !reduced) {
      try {
        var splits = chs.map(function (el) {
          return new SplitText(el, { type: "chars" });
        });
        tl.from(splits.map(function (s) { return s.chars; }), {
          yPercent: 120,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: { each: 0.022, from: "start" }
        }, 0.15);
      } catch (err) {
        tl.from(chs, { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12 }, 0.15);
      }
    } else {
      tl.from(chs, { yPercent: reduced ? 0 : 110, opacity: 0, duration: reduced ? 0.01 : 1, stagger: 0.12 }, 0.15);
    }

    var lift = reduced ? 0 : 26;

    tl.fromTo(".hero-eyebrow", { y: lift * 0.5, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.1)
      .from(".brand", { y: -16, autoAlpha: 0, duration: 0.7 }, 0.05)
      .from(".nav-links a", { y: -12, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, 0.2)
      .from(".nav-cta", { y: -12, autoAlpha: 0, duration: 0.6 }, 0.35)
      .fromTo(".hero-rotator", { y: lift * 0.6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.85)
      .fromTo(".hero-lead", { y: lift, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 1.0)
      .fromTo(".hero-actions", { y: lift, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.15)
      .fromTo(".hero-meta", { y: lift, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.3)
      .fromTo(".scroll-cue", { y: lift * 0.5, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 1.5);

    return tl;
  }

  /* =========================================================
     4. ROTADOR DE PALABRAS
     ========================================================= */
  function rotator() {
    var el = document.getElementById("rotWord");
    if (!el) return;

    var words = ["marketing digital", "diseño gráfico", "contenido", "brand safety", "dirección de arte"];
    var i = 0;

    if (reduced) {
      el.textContent = words[0];
      return;
    }

    setInterval(function () {
      i = (i + 1) % words.length;
      gsap.timeline()
        .to(el, { yPercent: -110, autoAlpha: 0, duration: 0.35, ease: "power2.in" })
        .add(function () { el.textContent = words[i]; })
        .fromTo(el, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" });
    }, 2800);
  }

  /* =========================================================
     5. REVELADOS AL SCROLL
     ========================================================= */
  function reveals() {
    var d = reduced ? 0.01 : 1;

    // Encabezados de sección
    gsap.utils.toArray(".section-head, .split-side, .eyebrow:not(.hero-eyebrow)").forEach(function (el) {
      gsap.from(el, {
        y: reduced ? 0 : 34,
        autoAlpha: 0,
        duration: reduced ? 0.01 : 0.9,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    // Párrafos del perfil (acotado a #perfil: hay otro .split-main en #formacion)
    gsap.from("#perfil .split-main > *", {
      y: reduced ? 0 : 26,
      autoAlpha: 0,
      duration: reduced ? 0.01 : 0.8,
      stagger: 0.12,
      scrollTrigger: { trigger: "#perfil .split-main", start: "top 80%" }
    });

    // Ítems de la trayectoria
    gsap.utils.toArray(".tl-item").forEach(function (item) {
      gsap.from(item, {
        y: reduced ? 0 : 40,
        autoAlpha: 0,
        duration: reduced ? 0.01 : 0.85,
        scrollTrigger: { trigger: item, start: "top 86%" }
      });

      if (reduced) return;

      // El nodo se enciende al entrar
      gsap.from(item.querySelector(".tl-node"), {
        scale: 0,
        duration: 0.5,
        ease: "back.out(3)",
        scrollTrigger: { trigger: item, start: "top 86%" }
      });
    });

    // Chips de competencias
    gsap.utils.toArray(".skill-cluster").forEach(function (cluster) {
      gsap.from(cluster, {
        y: reduced ? 0 : 30,
        autoAlpha: 0,
        duration: reduced ? 0.01 : 0.7,
        scrollTrigger: { trigger: cluster, start: "top 88%" }
      });
      gsap.from(cluster.querySelectorAll(".chip"), {
        scale: reduced ? 1 : 0.82,
        autoAlpha: 0,
        duration: reduced ? 0.01 : 0.5,
        stagger: 0.035,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: cluster, start: "top 86%" }
      });
    });

    // Habilidades blandas
    gsap.from(".softs-kicker, .softs-head", {
      y: reduced ? 0 : 26,
      autoAlpha: 0,
      duration: reduced ? 0.01 : 0.8,
      stagger: 0.1,
      scrollTrigger: { trigger: ".softs", start: "top 82%" }
    });
    gsap.from(".soft", {
      y: reduced ? 0 : 30,
      autoAlpha: 0,
      duration: reduced ? 0.01 : 0.7,
      stagger: 0.1,
      scrollTrigger: { trigger: ".softs-grid", start: "top 85%" }
    });

    // Educación (immediateRender:false evita que pise el estado inicial de otros reveals)
    gsap.from(".edu-item", {
      y: reduced ? 0 : 28,
      autoAlpha: 0,
      duration: reduced ? 0.01 : 0.7,
      stagger: 0.12,
      immediateRender: false,
      scrollTrigger: { trigger: "#formacion", start: "top 78%" }
    });

    // Contacto
    gsap.from(".contact-title, .contact-lead, .contact-actions, .contact-links", {
      y: reduced ? 0 : 34,
      autoAlpha: 0,
      duration: reduced ? 0.01 : 0.85,
      stagger: 0.12,
      scrollTrigger: { trigger: "#contacto", start: "top 80%" }
    });

    return d;
  }

  /* =========================================================
     6. MÉTRICAS — contador
     ========================================================= */
  function counters() {
    gsap.utils.toArray(".metric").forEach(function (metric) {
      var numEl = metric.querySelector(".metric-num");
      var target = parseFloat(numEl.getAttribute("data-count")) || 0;

      if (reduced) { numEl.textContent = target; return; }

      var proxy = { v: 0 };
      gsap.to(proxy, {
        v: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: metric, start: "top 90%" },
        onUpdate: function () { numEl.textContent = Math.round(proxy.v); }
      });

      gsap.from(metric, {
        y: 24, autoAlpha: 0, duration: 0.8,
        scrollTrigger: { trigger: metric, start: "top 92%" }
      });
    });
  }

  /* =========================================================
     7. PROYECTOS — revelado tras renderizar (viene del Excel)
     ========================================================= */
  function projectsReveal() {
    document.addEventListener("projects:rendered", function () {
      var cards = gsap.utils.toArray(".proj");
      if (!cards.length) return;

      gsap.from(cards, {
        y: reduced ? 0 : 48,
        autoAlpha: 0,
        scale: reduced ? 1 : 0.96,
        duration: reduced ? 0.01 : 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "#projects", start: "top 85%" },
        onComplete: function () { ScrollTrigger.refresh(); }
      });
    });
  }

  /* =========================================================
     8. NAV — estado al scroll, enlace activo, scroll suave
     ========================================================= */
  function nav() {
    var navEl = document.getElementById("nav");

    ScrollTrigger.create({
      start: "top -80",
      end: "max",
      onToggle: function (self) { navEl.classList.toggle("is-scrolled", self.isActive); }
    });

    // Barra de progreso
    gsap.to("#progressFill", {
      width: "100%",
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 }
    });

    // Enlace activo
    gsap.utils.toArray("main section[id]").forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (!self.isActive) return;
          document.querySelectorAll(".nav-links a").forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + sec.id);
          });
        }
      });
    });

    // Scroll suave con compensación de la barra fija
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var id = a.getAttribute("href");
        if (id === "#" || !document.querySelector(id)) return;
        ev.preventDefault();
        closeMenu();
        gsap.to(window, {
          duration: reduced ? 0 : 1,
          ease: "power2.inOut",
          scrollTo: { y: id, offsetY: 84, autoKill: true }
        });
      });
    });
  }

  /* =========================================================
     9. MENÚ MÓVIL
     ========================================================= */
  var menu = document.getElementById("menu");
  var burger = document.getElementById("burger");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    gsap.fromTo(menu.querySelectorAll("a"),
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" });
  }

  function closeMenu() {
    if (!menu || !menu.classList.contains("is-open")) return;
    // Liberamos el overflow YA (sin esperar): si no, el scroll a la sección
    // se ejecuta contra un body bloqueado y no se mueve.
    document.body.style.overflow = "";

    gsap.to(menu.querySelectorAll("a"), {
      y: 20, autoAlpha: 0, duration: 0.25, stagger: 0.03,
      onComplete: function () {
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  function menuInit() {
    if (!burger || !menu) return;
    burger.addEventListener("click", function () {
      menu.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* =========================================================
     10. Botones magnéticos (solo puntero fino)
     ========================================================= */
  function magnetic() {
    if (reduced) return;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.querySelectorAll(".btn, .proj-btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.22,
          y: (e.clientY - (r.top + r.height / 2)) * 0.30,
          duration: 0.4, ease: "power2.out"
        });
      });
      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.45)" });
      });
    });
  }

  /* =========================================================
     Arranque
     ========================================================= */
  function init() {
    try {
      buildEmbers();
      memphisMotion();
      heroIntro();
      rotator();
      reveals();
      counters();
      projectsReveal();
      nav();
      menuInit();
      magnetic();

      // Tras cargar tipografías y proyectos, recalcular triggers
      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
      }
    } catch (err) {
      console.error("[main.js] Error en la animación, mostrando contenido:", err);
      revealAll();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
