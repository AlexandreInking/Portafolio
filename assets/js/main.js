/* ============================================================
   main.js · Capa de animación GSAP + interacción
   Sigue las prácticas oficiales de GSAP (skills gsap-*):
   timelines en vez de delays, transform aliases, autoAlpha,
   gsap.matchMedia() para responsive y prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  /* Huevo de pascua: saludo en consola para curiosos (solo PC) */
  try {
    var pcPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (pcPointer) {
      console.log(
        "%c      /\\\n     /  \\\n    | () |\n     \\  /\n      \\/\n%cHola, curioso. Si abriste DevTools, ya tenemos algo en común: nos gusta ver cómo están hechas las cosas. Hablemos: esplopale@gmail.com",
        "color:#FF8A1F;font-family:monospace;font-weight:bold",
        "color:#A9907C;font-size:12px"
      );
      var probe = document.createElement("div");
      Object.defineProperty(probe, "id", { get: function () { markEgg("consola"); return "curioso"; } });
      console.log("%c(objeto de inspector)", "color:#6E5B4C", probe);
    }
  } catch (e) {}

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

  var FIRE_EMBERS = ["#FFD447", "#FF8A1F", "#FF5B1F", "#E0231A", "#FFF6EC"];
  var AQUA_EMBERS = ["#22D3EE", "#38BDF8", "#2563EB", "#0891B2", "#0B1520"];

  function emberPalette() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? AQUA_EMBERS
      : FIRE_EMBERS;
  }

  /* =========================================================
     0. TEMA CLARO / OSCURO · conmuta data-theme, lo recuerda
     y actualiza brasas + theme-color
     ========================================================= */
  function themeInit() {
    var btn = document.getElementById("themeToggle");
    var meta = document.querySelector('meta[name="theme-color"]');

    function apply(t) {
      document.documentElement.setAttribute("data-theme", t);
      try { localStorage.setItem("portafolio-theme", t); } catch (e) {}
      if (meta) meta.setAttribute("content", t === "light" ? "#FFFFFF" : "#0A0705");
      if (btn) {
        var light = t === "light";
        btn.setAttribute("aria-pressed", light ? "true" : "false");
        btn.setAttribute("aria-label", light ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
      }
      var palette = t === "light" ? AQUA_EMBERS : FIRE_EMBERS;
      document.querySelectorAll(".ember").forEach(function (el, i) {
        el.style.background = palette[i % palette.length];
      });
    }

    if (btn) {
      btn.addEventListener("click", function () {
        apply(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
      });
      // Sincroniza el botón con el tema que dejó el script del <head>
      var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      var isLight = current === "light";
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
      btn.setAttribute("aria-label", isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
    }
    if (meta && document.documentElement.getAttribute("data-theme") === "light") {
      meta.setAttribute("content", "#FFFFFF");
    }
  }

  /* Cursor + viento compartidos por los efectos reactivos.
     Solo existen con puntero fino; en táctil todo queda en deriva base. */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cursor = { x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, active: false };
  var wind = { x: 0, y: 0 };

  function trackCursor() {
    if (!finePointer || reduced) return;
    var lastX = null, lastY = null, lastT = 0;
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var now = performance.now();
      if (lastX !== null) {
        var dt = Math.max(now - lastT, 1) / 16.666;
        var ivx = (e.clientX - lastX) / dt;
        var ivy = (e.clientY - lastY) / dt;
        cursor.vx += (ivx - cursor.vx) * 0.3;
        cursor.vy += (ivy - cursor.vy) * 0.3;
      }
      lastX = e.clientX; lastY = e.clientY; lastT = now;
      cursor.x = e.clientX; cursor.y = e.clientY;
      cursor.active = true;
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () {
      cursor.active = false;
      cursor.vx = 0; cursor.vy = 0;
    });
  }

  /* Energía de scroll: bajar genera x2, subir x1.5 (pide más brasas) */
  var scrollEnergy = 0;
  var lastScrollY = 0;

  function trackScroll() {
    if (reduced) return;
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var dy = y - lastScrollY;
      lastScrollY = y;
      scrollEnergy = Math.min(scrollEnergy + Math.abs(dy) * (dy > 0 ? 2 : 1.5) * 0.06, 100);
    }, { passive: true });
  }

  /* =========================================================
     1. CAMPO DE BRASAS · física propia (deriva + viento +
     repulsión al cursor con impacto por velocidad)
     ========================================================= */
  var embers = [];
  var baseCount = 0;
  var maxExtra = 0;
  var emberFieldEl = null;

  function resetEmber(b, randomY) {
    var palette = emberPalette();
    b.size = 2 + Math.random() * 3;
    b.x = Math.random() * window.innerWidth;
    b.y = randomY ? Math.random() * window.innerHeight : window.innerHeight + 20;
    b.vx = 0; b.vy = 0;
    b.maxLife = 9000 + Math.random() * 9000;
    b.life = randomY ? Math.random() * b.maxLife : 0;
    b.seed = Math.random() * 1000;
    b.el.style.width = b.size + "px";
    b.el.style.height = b.size + "px";
    b.el.style.left = "0";
    b.el.style.top = "0";
    b.el.style.background = (performance.now() < partyUntil)
      ? "hsl(" + ((Math.random() * 360) | 0) + ",90%,60%)"
      : palette[(Math.random() * palette.length) | 0];
  }

  function spawnEmber(randomY, extra) {
    var e = document.createElement("span");
    e.className = "ember";
    emberFieldEl.appendChild(e);
    var b = { el: e, x: 0, y: 0, vx: 0, vy: 0, size: 3, life: 0, maxLife: 1, seed: 0, extra: !!extra };
    resetEmber(b, randomY);
    if (extra) b.maxLife = 4000 + Math.random() * 3000;
    embers.push(b);
  }

  function buildEmbers() {
    var field = document.getElementById("emberField");
    if (!field) return;

    if (reduced) { field.style.display = "none"; return; }

    emberFieldEl = field;
    baseCount = window.innerWidth < 768 ? 28 : 60;
    maxExtra = Math.round(baseCount * 0.8);
    for (var i = 0; i < baseCount; i++) spawnEmber(true, false);

    memphisCursor();
    lastFrame = performance.now();
    requestAnimationFrame(emberLoop);
  }

  var lastFrame = 0;

  function emberLoop(now) {
    var dt = Math.min(((now - lastFrame) / 16.666) || 1, 3);
    lastFrame = now;

    // El viento sigue la velocidad del cursor y se calma solo
    cursor.vx *= Math.pow(0.93, dt);
    cursor.vy *= Math.pow(0.93, dt);
    cursor.speed = Math.sqrt(cursor.vx * cursor.vx + cursor.vy * cursor.vy);
    wind.x += ((cursor.vx * 0.05) - wind.x) * Math.min(0.05 * dt, 1);
    wind.y += ((cursor.vy * 0.05) - wind.y) * Math.min(0.05 * dt, 1);

    // La energía del scroll pide brasas extra (bajar x2, subir x1.5)
    scrollEnergy *= Math.pow(0.95, dt);
    var storm = now < stormUntil;
    partyOn = now < partyUntil;
    var target = baseCount + Math.round((scrollEnergy / 100) * maxExtra);
    if (batterySave) target = Math.round(baseCount * 0.5);
    if (storm) target = baseCount + maxExtra * 2;
    while (embers.length < target && embers.length < baseCount + maxExtra * 2) {
      spawnEmber(true, true);
    }
    // En tormenta las brasas caen como lluvia en vez de subir
    var driftY = storm ? 2.4 : -0.6;

    var W = window.innerWidth;
    var H = window.innerHeight;
    var R = 150;
    var impact = Math.min(cursor.speed / 45, 2);

    for (var j = 0; j < embers.length; j++) {
      var p = embers[j];
      p.life += dt * 16.666;

      var sway = Math.sin(now / 1600 + p.seed) * 0.35;
      p.vx += ((sway + wind.x) - p.vx) * Math.min(0.035 * dt, 1);
      p.vy += ((driftY - wind.y * 0.5) - p.vy) * Math.min(0.025 * dt, 1);

      // Repulsión: más fuerte y amplia según la velocidad del cursor
      if (cursor.active) {
        var dx = p.x - cursor.x;
        var dy = p.y - cursor.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < R && d > 0.01) {
          var f = (1 - d / R) * (0.9 + impact * 1.8);
          p.vx += (dx / d) * f * dt;
          p.vy += (dy / d) * f * dt;
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.y < -30 || p.y > H + 30 || p.x < -40 || p.x > W + 40 || p.life > p.maxLife) {
        if (p.extra) {
          p.el.remove();
          embers.splice(j, 1);
          j--;
          continue;
        }
        resetEmber(p, false);
        continue;
      }

      var alpha = p.life < 1800 ? (p.life / 1800) * 0.8 : 0.8;
      if (batterySave) alpha *= 0.35;
      p.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0)";
      p.el.style.opacity = alpha.toFixed(3);
    }

    updateCursorLayers();
    requestAnimationFrame(emberLoop);
  }

  /* Memphis con parallax de cursor (propiedad `translate`: no pelea
     con el `transform` que GSAP ya anima en deriva + scroll) */
  var mmLayers = [];

  function memphisCursor() {
    if (!finePointer || reduced) return;
    mmLayers = gsap.utils.toArray(".mm").map(function (el, k) {
      return { el: el, depth: 0.06 + (k % 4) * 0.05, x: 0, y: 0 };
    });
  }

  var heroTitleEl = null;
  var titleGlow = 0;

  function updateCursorLayers() {
    var k, s;
    if (mmLayers.length && cursor.active) {
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      for (k = 0; k < mmLayers.length; k++) {
        s = mmLayers[k];
        var tx = (cursor.x - cx) * s.depth * 0.55;
        var ty = (cursor.y - cy) * s.depth * 0.55;
        s.x += (tx - s.x) * 0.06;
        s.y += (ty - s.y) * 0.06;
        s.el.style.translate = s.x.toFixed(1) + "px " + s.y.toFixed(1) + "px";
      }
    }
    // El título respira: brilla más cuando el cursor se acerca
    if (finePointer && !reduced) {
      if (!heroTitleEl) heroTitleEl = document.querySelector(".hero-title");
      if (heroTitleEl) {
        var r = heroTitleEl.getBoundingClientRect();
        var qx = cursor.active ? cursor.x - (r.left + r.width / 2) : 9999;
        var qy = cursor.active ? cursor.y - (r.top + r.height / 2) : 9999;
        var dist = Math.sqrt(qx * qx + qy * qy);
        var target = partyOn ? 1 : Math.max(0, 1 - dist / 520);
        titleGlow += (target - titleGlow) * 0.08;
        heroTitleEl.style.setProperty("--title-glow", (titleGlow * 16).toFixed(1) + "px");
        heroTitleEl.style.setProperty("--title-bright", (1 + titleGlow * 0.07).toFixed(3));
      }
    }
  }

  /* =========================================================
     2. GEOMETRÍA MEMPHIS · deriva infinita + parallax
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
     3. HERO · intro
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

    var words = ["marketing digital", "diseño gráfico", "contenido", "brand safety", "game design", "game development", "game asset creation"];
    var recent = [el.textContent];

    function pickNext() {
      var pool = words.filter(function (w) { return recent.indexOf(w) === -1; });
      var next = pool[(Math.random() * pool.length) | 0];
      recent.push(next);
      if (recent.length > 2) recent.shift();
      return next;
    }

    if (reduced) {
      el.textContent = words[0];
      return;
    }

    setInterval(function () {
      var next = pickNext();
      gsap.timeline()
        .to(el, { yPercent: -110, autoAlpha: 0, duration: 0.35, ease: "power2.in" })
        .add(function () { el.textContent = next; })
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
     6. MÉTRICAS · contador
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
      7. PROYECTOS · revelado tras renderizar (viene de data/projects.json)
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
     8. NAV · estado al scroll, enlace activo, scroll suave
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
     11. EASTER EGGS · toast, konami, GG, fantasma, fuegos, logro
     ========================================================= */
  var stormUntil = 0;
  var partyUntil = 0;
  var partyOn = false;
  var toastTimer = null;

  /* Colección de easter eggs: en PC se muestran los de PC,
     en celular los de celular. Se guarda en localStorage. */
  var EGGS_PC = [
    { id: "konami", name: "Código legendario", hint: "Una secuencia de flechas y letras de otra época..." },
    { id: "consola", name: "Ojos curiosos", hint: "Abre las herramientas de desarrollo." },
    { id: "flama", name: "Aviva la flama", hint: "La página perdida esconde una flama juguetona." },
    { id: "fantasma", name: "¿Sigues ahí?", hint: "Quédate quieto un buen rato..." },
    { id: "fuegos", name: "Celebración", hint: "Haz clic en mi correo." },
    { id: "logro", name: "Lector completo", hint: "Llega hasta el final de la página." },
    { id: "fiesta", name: "GG", hint: "Dos veces la misma letra gamer." }
  ];
  var EGGS_MOBILE = [
    { id: "shake", name: "Terremoto", hint: "Sacude el celular..." },
    { id: "holdlogo", name: "Paciencia", hint: "Quédate 5 segundos con el dedo quieto en la pantalla..." },
    { id: "landscape", name: "Panorámica", hint: "Gira el celular a horizontal..." },
    { id: "tripletap", name: "Tercer dedo", hint: "Toca con tres dedos a la vez..." },
    { id: "holdmail", name: "Copiado", hint: "Mantén presionado mi correo..." },
    { id: "dragtitle", name: "Detrás del nombre", hint: "Arrastra el título a un lado..." },
    { id: "nightowl", name: "Trasnochador", hint: "Abre el portafolio de madrugada..." },
    { id: "battery", name: "Ahorro", hint: "Entra con la batería baja..." }
  ];

  function eggList() { return finePointer ? EGGS_PC : EGGS_MOBILE; }

  function getEggs() {
    try { return JSON.parse(localStorage.getItem("portafolio-eggs")) || {}; }
    catch (e) { return {}; }
  }

  function eggProgress() {
    var list = eggList();
    var found = getEggs();
    var n = list.filter(function (g) { return !!found[g.id]; }).length;
    return { n: n, total: list.length };
  }

  function markEgg(id) {
    var found = getEggs();
    if (found[id]) return;
    found[id] = true;
    try { localStorage.setItem("portafolio-eggs", JSON.stringify(found)); } catch (e) {}
    updateEggBadge();
    renderEggList();
    var p = eggProgress();
    showToast("Huevo encontrado: " + p.n + "/" + p.total + " en tu colección.", 2500);
  }

  function updateEggBadge() {
    var badge = document.getElementById("eggCount");
    if (!badge) return;
    var p = eggProgress();
    badge.textContent = p.n + "/" + p.total;
  }

  function renderEggList() {
    var ul = document.getElementById("eggList");
    if (!ul) return;
    var sub = document.getElementById("eggSub");
    var fill = document.getElementById("eggFill");
    var mobile = !finePointer;
    var list = eggList();
    if (sub) sub.textContent = mobile
      ? "Cazados en este dispositivo: celular."
      : "Cazados en este dispositivo: PC. Los de celular solo aparecen en celular.";
    var found = getEggs();
    var n = 0;
    ul.innerHTML = list.map(function (g) {
      var has = !!found[g.id];
      if (has) n++;
      return '<li class="egg' + (has ? " found" : "") + '"><span class="egg-ico">' + (has ? "●" : "○") + '</span><span class="egg-text"><span class="egg-name">' + (has ? g.name : "???") + '</span><span class="egg-hint">' + g.hint + "</span></span></li>";
    }).join("") || '<li class="egg-empty">Aún no hay huevos para este dispositivo.</li>';
    if (fill) fill.style.width = (list.length ? (n / list.length) * 100 : 0) + "%";
  }

  /* Huevos de celular: solo con táctil */
  var isTouch = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || ("ontouchstart" in window);
  var batterySave = false;

  function burstAt(cx, cy, n) {
    for (var bi = 0; bi < (n || 16); bi++) {
      if (embers.length > baseCount + maxExtra * 2) break;
      spawnEmber(false, true);
      var bp = embers[embers.length - 1];
      var ba = Math.random() * Math.PI * 2;
      var bsp = 2 + Math.random() * 4;
      bp.x = cx; bp.y = cy;
      bp.vx = Math.cos(ba) * bsp;
      bp.vy = Math.sin(ba) * bsp - 2;
      bp.maxLife = 1200 + Math.random() * 800;
      bp.life = 900;
    }
  }

  function longPress(el, ms, cb, allowMove) {
    var t = null;
    function cancel() { if (t) { clearTimeout(t); t = null; } }
    el.addEventListener("pointerdown", function () {
      cancel();
      t = setTimeout(function () { t = null; cb(); }, ms);
    });
    var evs = allowMove
      ? ["pointerup", "pointerleave", "pointercancel"]
      : ["pointerup", "pointerleave", "pointercancel", "pointermove"];
    evs.forEach(function (ev) {
      el.addEventListener(ev, cancel, { passive: true });
    });
  }

  function shakeInit() {
    if (reduced || !isTouch || !("DeviceMotionEvent" in window)) return;
    var last = null, cool = 0;
    function onMotion(e) {
      var a = e.accelerationIncludingGravity;
      if (!a || a.x === null) return;
      var now = performance.now();
      if (last && now - cool > 6000) {
        var d = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z);
        if (d > 24) {
          cool = now;
          stormUntil = now + 5000;
          markEgg("shake");
          showToast("Terremoto: lluvia de brasas.", 3500);
        }
      }
      last = { x: a.x, y: a.y, z: a.z };
    }
    function enable() { window.addEventListener("devicemotion", onMotion); }
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      window.addEventListener("pointerdown", function ask() {
        window.removeEventListener("pointerdown", ask);
        DeviceMotionEvent.requestPermission().then(function (r) { if (r === "granted") enable(); }).catch(function () {});
      });
    } else {
      enable();
    }
  }

  function holdScreenInit() {
    if (reduced || !isTouch) return;
    var t = null, armT = null, sx = 0, sy = 0, longTouch = false;
    function cancel() {
      if (t) { clearTimeout(t); t = null; }
      if (armT) { clearTimeout(armT); armT = null; }
    }
    document.addEventListener("pointerdown", function (e) {
      if (e.pointerType && e.pointerType !== "touch") return;
      cancel();
      sx = e.clientX; sy = e.clientY;
      longTouch = false;
      armT = setTimeout(function () { longTouch = true; }, 500);
      t = setTimeout(function () {
        t = null;
        markEgg("holdlogo");
        showToast("La paciencia también es una skill.", 4000);
      }, 5000);
    }, { passive: true });
    document.addEventListener("pointermove", function (e) {
      if (!t) return;
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 12) cancel();
    }, { passive: true });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      document.addEventListener(ev, cancel, { passive: true });
    });
    document.addEventListener("scroll", cancel, { passive: true });
    document.addEventListener("contextmenu", function (e) {
      if (longTouch) { e.preventDefault(); longTouch = false; }
    });
  }

  function landscapeInit() {
    if (reduced || !isTouch || !window.matchMedia) return;
    var mq = window.matchMedia("(orientation: landscape)");
    function onChange(e) {
      if (!e.matches) return;
      for (var i = 0; i < 16 && embers.length < baseCount + maxExtra; i++) spawnEmber(true, true);
      if (!getEggs().landscape) {
        markEgg("landscape");
        showToast("Buena vista panorámica.", 4000);
      }
    }
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function tripleTapInit() {
    if (reduced || !isTouch) return;
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length === 3) {
        if (e.cancelable) e.preventDefault();
        var html = document.documentElement;
        var cur = html.getAttribute("data-theme") === "light" ? "light" : "dark";
        var tmp = cur === "light" ? "dark" : "light";
        html.setAttribute("data-theme", tmp);
        markEgg("tripletap");
        showToast("Tema prestado por 10 segundos.", 3500);
        setTimeout(function () {
          if (html.getAttribute("data-theme") === tmp) html.setAttribute("data-theme", cur);
        }, 10000);
      }
    }, { passive: false });
  }

  function holdMailInit() {
    if (reduced || !isTouch) return;
    var btn = document.querySelector('.contact-actions a[href^="mailto:"]');
    if (!btn) return;
    var held = false;
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    longPress(btn, 600, function () {
      held = true;
      var mail = "esplopale@gmail.com";
      function done() {
        var r = btn.getBoundingClientRect();
        burstAt(r.left + r.width / 2, r.top + r.height / 2, 14);
        markEgg("holdmail");
        showToast("Correo copiado. Escríbeme cuando quieras.", 3500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = mail;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        ta.remove();
        done();
      }
    });
    btn.addEventListener("click", function (e) {
      if (held) { e.preventDefault(); held = false; }
    });
  }

  function dragTitleInit() {
    if (reduced || !isTouch) return;
    var title = document.querySelector(".hero-title");
    if (!title) return;
    var sx = 0, sy = 0, on = false, shown = false;
    var lines = title.querySelectorAll(".line");
    function paintLines(v) {
      for (var li = 0; li < lines.length; li++) lines[li].style.translate = v;
    }
    title.addEventListener("touchstart", function (e) {
      var t = e.touches[0];
      sx = t.clientX; sy = t.clientY; on = true;
    }, { passive: true });
    title.addEventListener("touchmove", function (e) {
      if (!on) return;
      var t = e.touches[0];
      var dx = t.clientX - sx;
      var dy = t.clientY - sy;
      if (Math.abs(dx) > Math.abs(dy) * 1.5) {
        paintLines(dx.toFixed(0) + "px 0");
        if (Math.abs(dx) > 60) {
          title.classList.add("peek");
          if (!shown) { shown = true; markEgg("dragtitle"); }
        }
      }
    }, { passive: true });
    function end() {
      if (!on) return;
      on = false;
      paintLines("");
      title.classList.remove("peek");
    }
    title.addEventListener("touchend", end, { passive: true });
    title.addEventListener("touchcancel", end, { passive: true });
  }

  function nightOwlInit() {
    if (reduced || !isTouch) return;
    if (new Date().getHours() < 6) {
      setTimeout(function () {
        markEgg("nightowl");
        showToast("¿Trasnochando? Yo también hice esto de noche.", 5000);
      }, 2500);
    }
  }

  function batteryInit() {
    if (reduced || !isTouch || !navigator.getBattery) return;
    navigator.getBattery().then(function (batt) {
      if (batt.level < 0.15 && !batt.charging) {
        batterySave = true;
        setTimeout(function () {
          markEgg("battery");
          showToast("Batería baja: descansemos los dos.", 5000);
        }, 3500);
      }
    }).catch(function () {});
  }
  function eggPanelInit() {
    var btn = document.getElementById("eggBtn");
    var modal = document.getElementById("eggModal");
    var close = document.getElementById("eggClose");
    if (!btn || !modal) return;
    updateEggBadge();
    renderEggList();
    btn.addEventListener("click", function () {
      renderEggList();
      modal.hidden = false;
      requestAnimationFrame(function () { modal.classList.add("open"); });
      if (close) close.focus();
    });
    function hide() {
      modal.classList.remove("open");
      setTimeout(function () { modal.hidden = true; }, 250);
    }
    if (close) close.addEventListener("click", hide);
    modal.addEventListener("click", function (e) { if (e.target === modal) hide(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) hide(); });
  }

  function showToast(msg, ms) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, ms || 4200);
  }

  function easterKeys() {
    if (reduced || !finePointer) return;
    var seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var pos = 0;
    var lastG = 0;
    document.addEventListener("keydown", function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          stormUntil = performance.now() + 10000;
          markEgg("konami");
          showToast("Ves, los videojuegos sí sirven para algo.", 5000);
        }
      } else {
        pos = (k === seq[0]) ? 1 : 0;
      }
      if (k === "g") {
        var now = performance.now();
        if (now - lastG < 800) {
          lastG = 0;
          partyUntil = now + 15000;
          document.documentElement.classList.add("party");
          markEgg("fiesta");
          showToast("Modo fiesta: 15 segundos. GG.", 4000);
          setTimeout(function () { document.documentElement.classList.remove("party"); }, 15100);
        } else {
          lastG = now;
        }
      }
    });
  }

  function ghostInit() {
    if (!finePointer || reduced) return;
    var idleTimer = null;
    function arm() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        wind.x = 8;
        for (var i = 0; i < 24 && embers.length < baseCount + maxExtra; i++) spawnEmber(true, true);
        markEgg("fantasma");
        showToast("¿Sigues ahí? Mueve el mouse para avivar las brasas.", 5000);
      }, 30000);
    }
    ["pointermove", "keydown", "scroll", "click"].forEach(function (ev) {
      window.addEventListener(ev, arm, { passive: true });
    });
    arm();
  }

  function fireworksInit() {
    if (reduced || !finePointer) return;
    var btn = document.querySelector('.contact-actions a[href^="mailto:"]');
    if (!btn) return;
    btn.addEventListener("click", function () {
      markEgg("fuegos");
      var r = btn.getBoundingClientRect();
      burstAt(r.left + r.width / 2, r.top + r.height / 2, 16);
    });
  }

  function achievementInit() {
    var foot = document.querySelector(".footer");
    if (!foot || reduced || !finePointer || !("IntersectionObserver" in window)) return;
    var seen = null;
    try { seen = sessionStorage.getItem("portafolio-logro"); } catch (e) {}
    if (seen) return;
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        markEgg("logro");
        showToast("🏆 Logro desbloqueado: llegaste al final. Pocos lo hacen.", 5000);
        try { sessionStorage.setItem("portafolio-logro", "1"); } catch (e) {}
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(foot);
  }

  /* =========================================================
     Arranque
     ========================================================= */
  function init() {
    try {
      themeInit();
      trackCursor();
      trackScroll();
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
      easterKeys();
      achievementInit();
      ghostInit();
      fireworksInit();
      eggPanelInit();
      shakeInit();
      holdScreenInit();
      landscapeInit();
      tripleTapInit();
      holdMailInit();
      dragTitleInit();
      nightOwlInit();
      batteryInit();

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
