# Design System: IGNIS — Fire-Dark Editorial Portfolio

> Author: Alejandro Espinoza López · Portfolio personal
> Basis: **Framer** (pure void canvas, pill interactives, extreme negative tracking, motion-first)
> crossed with **Corporate Memphis** (organic floating shapes, flat abstract geometry, optimistic energy),
> re-skinned with a **fire palette**. Anti-pattern: boxes, cards with borders, purple, neon.

---

## 1. Visual Theme & Atmosphere

IGNIS is a cinematic void that glows from within. The canvas is a **warm near-black** (`#0A0705`) —
not neutral gray, not cool charcoal — so the fire palette reads as heat against ember-darkness rather
than as neon against black. Every section is lit by **radial gradient auras** (embers), never by
containers. There are **no boxes**: no bordered cards, no outlined panels, no sharp rectangles.
Content is separated by typography, whitespace, and soft glow — not by edges.

Depth comes from light, not from borders. Interactive elements are **pills** (fully rounded).
Section rhythm comes from gradient hairlines (`1px`, `linear-gradient` fading at both ends) and from
drifting Memphis geometry: arcs, squiggles, lozenges, dots-grids and blobs in white / yellow /
orange / red, animated continuously with GSAP (float, drift, rotate, parallax on scroll).

The emotional register: **heat, momentum, craft**. A person in transition — operations and
Trust & Safety background, now marketing + design — should feel like someone who has *already been
doing the work*, just under a different job title. Confident, warm, not corporate-stiff, not childish.

**Key Characteristics**
- Warm void canvas `#0A0705` with ember radial glows (never flat black, never cool gray)
- **Zero boxes** — no bordered containers; separation by whitespace + glow + gradient hairlines
- Pill interactives (100px radius) — no squared or lightly-rounded buttons
- Fire palette only: white → yellow → orange → red. **No purple. No neon. No cyan/magenta/lime.**
- Corporate Memphis geometry as drifting background decor (abstract only — no human figures)
- Extreme negative tracking on display type (-0.04em and tighter at scale)
- Motion-first: GSAP timelines, ScrollTrigger scrub, magnetic hover, ember particle field

---

## 2. Color Palette & Roles

### Fire Scale (the only hues allowed)
| Token | Hex | Role |
|-------|-----|------|
| `--fire-white` | `#FFF6EC` | Primary text, headings, high-emphasis copy (warm white, never pure `#fff`) |
| `--fire-amber` | `#FFD447` | Primary accent — highlights, active nav, eyebrow labels, spark |
| `--fire-flame` | `#FF8A1F` | Secondary accent — gradients, links on dark, glow core |
| `--fire-blaze` | `#FF5B1F` | Emphasis accent — gradient mid-stop, hover heat |
| `--fire-blood` | `#E0231A` | Deep accent — gradient end, dramatic moments |
| `--fire-coal` | `#8C1008` | Dark accent — gradient shadow stop, inactive embers |

### Surfaces (warm neutrals)
| Token | Hex | Role |
|-------|-----|------|
| `--void` | `#0A0705` | Page background — warm near-black |
| `--void-2` | `#14100C` | Alternate section surface (subtle, no border) |
| `--void-3` | `#1F1811` | Raised surface (organic panel fill, still borderless) |
| `--ash` | `#3A2E24` | Hairlines, dividers, inactive tracks |
| `--smoke` | `#A9907C` | Secondary / muted body text |
| `--smoke-dim` | `#6E5B4C` | Tertiary text, captions, meta |

### Gradients
- **Flame (primary)**: `linear-gradient(100deg, #FFD447 0%, #FF8A1F 38%, #FF5B1F 68%, #E0231A 100%)`
- **Ember (soft)**: `linear-gradient(180deg, #FF8A1F 0%, #8C1008 100%)`
- **Spark (text)**: `linear-gradient(92deg, #FFF6EC 0%, #FFD447 45%, #FF8A1F 100%)`
- **Glow radial**: `radial-gradient(circle, rgba(255,138,31,.28) 0%, rgba(255,91,31,.10) 45%, transparent 70%)`
- **Hairline**: `linear-gradient(90deg, transparent, #3A2E24 18%, #FF8A1F 50%, #3A2E24 82%, transparent)`

### Semantic
- Success / active: `--fire-amber`
- Link: `--fire-flame`, hover → `--fire-amber`
- Focus ring: `0 0 0 2px #0A0705, 0 0 0 4px #FFD447`

### Forbidden
- ❌ Any purple / violet / indigo (`#43089f`, `#7c3aed`, `#8b5cf6`, …)
- ❌ Any neon / electric hue (cyan `#00ffff`, magenta `#ff00ff`, lime `#adff2f`, electric blue `#0099ff`)
- ❌ Cool gray backgrounds (`#111`, `#1a1a1a`, `#2d2d2d`)
- ❌ Pure white `#ffffff` (use warm `--fire-white`)
- ❌ Visible 1px borders around content containers

---

## 3. Typography Rules

### Fonts
- **Display**: `Archivo` (variable, 700–900) — condensed-impact geometric sans; the marketing voice
- **Body**: `Inter` (variable, 400–600) — readable, neutral, professional
- **Label / metric**: `Space Mono` (400, 700) — data labels, years, tags, nav micro-labels
- Fallbacks: `-apple-system, "Segoe UI", system-ui, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | LH | Tracking | Notes |
|------|------|------|--------|----|----------|-------|
| Hero display | Archivo | clamp(3.2rem, 9vw, 8rem) | 900 | 0.88 | -0.045em | Gradient `Spark` fill; split-reveal on load |
| Section heading | Archivo | clamp(2.1rem, 5vw, 4rem) | 800 | 0.95 | -0.035em | Warm white |
| Sub-heading | Archivo | clamp(1.4rem, 2.4vw, 2rem) | 700 | 1.10 | -0.02em | |
| Card/project title | Archivo | 1.75rem | 800 | 1.10 | -0.025em | |
| Feature title | Archivo | 1.15rem | 700 | 1.25 | -0.015em | |
| Lead body | Inter | clamp(1.05rem, 1.5vw, 1.35rem) | 400 | 1.65 | -0.005em | `--smoke` on hero |
| Body | Inter | 1rem | 400 | 1.70 | normal | `--smoke` |
| Eyebrow / label | Space Mono | 0.72rem | 700 | 1.40 | 0.18em | UPPERCASE, `--fire-amber` |
| Metric number | Archivo | clamp(2.4rem, 5vw, 3.6rem) | 900 | 1.00 | -0.04em | Flame gradient text |
| Metric label | Space Mono | 0.7rem | 400 | 1.50 | 0.12em | UPPERCASE, `--smoke-dim` |
| Nav link | Inter | 0.9rem | 500 | 1.00 | normal | hover → `--fire-amber` |
| Button | Inter | 0.95rem | 600 | 1.00 | 0.01em | Pill, 100px radius |

### Principles
- **Compression = personality**: display tracking is always negative and aggressive at scale.
- **Three weights only**: 900/800 display, 700/600 UI+sub, 400 body. No 500 display type.
- **Numbers are display type**: metrics get Archivo 900 gradient, never plain body text.
- **Mono for wayfinding**: every eyebrow, tag, year, and metric label is Space Mono uppercase.

---

## 4. Component Stylings

### Buttons
- **Primary (Flame pill)**: background `Flame` gradient, text `#0A0705`, padding `1rem 2rem`,
  radius `100px`, weight 700. Hover: `y: -3`, `scale: 1.03`, glow `0 12px 40px rgba(255,138,31,.45)`.
- **Ghost pill**: transparent, text `--fire-white`, `1px solid rgba(255,246,236,.18)`, radius `100px`.
  Hover: border → `rgba(255,212,71,.55)`, text → `--fire-amber`, subtle inward glow.
- **Text link**: `--fire-flame`, 1px animated underline that wipes in from left on hover.
- **Focus**: `0 0 0 2px #0A0705, 0 0 0 4px #FFD447`. Never remove focus rings.

### Content surfaces (NOT boxes)
- **Organic panel**: background `radial-gradient(120% 120% at 20% 0%, rgba(255,138,31,.10), transparent 60%)`
  over `--void-3`, radius `44px`, **no border**. Separation comes from the glow, not an outline.
- **Project panel**: radius `48px`, `background: linear-gradient(160deg, #1F1811, #14100C)`,
  an inner `::before` radial glow tinted by the project's `Color` column from `Proyectos.xlsx`,
  a `2px` gradient top-edge bar (not a full border), and a large Memphis accent shape bleeding off-edge.
- **Stat**: no container at all — number + mono label floating in whitespace.
- **Hairline divider**: 1px, `Hairline` gradient, max-width 100%, no box.

### Tags / chips
- Pill (`100px`), `background: rgba(255,138,31,.10)`, `color: #FFD447`,
  Space Mono 0.7rem uppercase, padding `.35rem .85rem`. No border.

### Navigation
- Fixed, `backdrop-filter: blur(18px)`, background `rgba(10,7,5,.62)` — **no bottom border**;
  instead a hairline gradient that fades at both ends. Pill CTA on the right.
- On scroll > 80px: background opacity increases to `.88`, nav shrinks slightly (GSAP).
- Mobile: full-screen overlay menu, links at Archivo 800 / 2.2rem, staggered in with GSAP.

### Memphis decor
- Abstract flat geometry only: arcs, half-circles, squiggles, lozenges, rings, dot-grids, blobs.
- Colors: `--fire-white` @ 6–12% opacity for large shapes; `--fire-amber` / `--fire-flame` /
  `--fire-blood` @ 20–45% for small accents. **No human figures.**
- Every shape drifts (GSAP `repeat: -1, yoyo: true`) and parallaxes on scroll at differing depths.

### Ember field
- ~28 absolutely-positioned particles (2–5px), flame-palette colors, rising with random
  `x` sway, opacity flicker, infinite. `prefers-reduced-motion` → hidden entirely.

---

## 5. Layout Principles

### Spacing
- Base unit **8px**. Scale: `8, 16, 24, 32, 48, 64, 96, 128, 160`.
- Section vertical padding: `clamp(6rem, 12vh, 11rem)` — generous; the void is the breathing room.
- Between-section separator: hairline + `96px` whitespace.

### Grid & Container
- Max content width `1180px`, centered, `padding-inline: clamp(1.25rem, 5vw, 3rem)`.
- Profile / trajectory: asymmetric `38% / 58%` split with `4%` gap on desktop, stacked on mobile.
- Projects: auto-fit grid `minmax(320px, 1fr)`, gap `32px`.
- Metrics: auto-fit `minmax(150px, 1fr)` — borderless, glow-separated.

### Whitespace Philosophy
- **Breathe through darkness.** Space is void, not container.
- **Dense within, spacious between.** Copy lines stay tight; sections stay far apart.
- **Nothing is framed.** If an element needs definition, give it glow — never an outline.

### Border Radius Scale
- `100px` — all buttons, all pills, all chips (interactive = always fully round)
- `48px` — project panels
- `44px` — organic content panels
- `24px` — inline media / logo marks
- `0` — never used on a visible container

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 — Void | no shadow, `--void` | page background |
| 1 — Glow | `radial-gradient` ember behind content | section lighting |
| 2 — Lift | `0 24px 70px -30px rgba(0,0,0,.9)` + inner top highlight `inset 0 1px 0 rgba(255,246,236,.06)` | organic panels, project panels |
| 3 — Heat | `0 12px 44px rgba(255,138,31,.42)` | primary button hover, active card |
| Focus | `0 0 0 2px #0A0705, 0 0 0 4px #FFD447` | keyboard focus |

**Shadow philosophy (inverted, dark-theme)**: light is added, darkness is not. Elevation =
warm glow + a faint white top-edge inset. **Never** use a `1px solid` outline to imply elevation.

---

## 7. Do's and Don'ts

### Do
- ✅ Keep the canvas warm near-black (`#0A0705`) at all times
- ✅ Separate content with whitespace, glow, typography, and gradient hairlines — **never boxes**
- ✅ Make every interactive element a full pill
- ✅ Use the fire scale for *all* color; keep white warm (`#FFF6EC`)
- ✅ Animate with GSAP: timelines, ScrollTrigger scrub, `gsap.matchMedia()` for reduced motion
- ✅ Give every number the Archivo 900 gradient treatment
- ✅ Keep Memphis decor abstract and low-opacity

### Don't
- ❌ Draw a border around a content container
- ❌ Use sharp or lightly-rounded (`4–12px`) corners on interactive elements
- ❌ Introduce purple, violet, indigo, cyan, magenta, lime, or electric blue
- ❌ Use pure `#ffffff` text or cool-gray (`#1a1a1a`) backgrounds
- ❌ Animate layout properties (`width`, `height`, `top`, `left`) — transforms only
- ❌ Use Memphis human figures (dates the design and reads generic)
- ❌ Let an ember particle or shape sit still — the page must always breathe

---

## 8. Responsive Behavior

| Breakpoint | Width | Changes |
|-----------|-------|---------|
| Mobile | < 640px | single column, hero display → clamp floor, nav → overlay, embers → 12 particles |
| Tablet | 640–1023px | 2-col projects, profile stacked, metrics 2-col |
| Desktop | 1024–1439px | full asymmetric splits, 2-col projects |
| Wide | ≥ 1440px | max-width 1180px centered, larger ember field |

- Touch targets: ≥ 44px height on all interactive elements.
- Nav collapses to hamburger at < 900px.
- Reduced motion (`prefers-reduced-motion: reduce`): embers hidden, reveals become instant
  `autoAlpha` fades (duration 0.01), no parallax, no infinite drift.

---

## 9. Agent Prompt Guide

### Quick reference
```
bg          #0A0705      surface      #1F1811
text        #FFF6EC      muted        #A9907C
accent-1    #FFD447      accent-2     #FF8A1F
accent-3    #FF5B1F      accent-4     #E0231A
flame-grad  linear-gradient(100deg,#FFD447,#FF8A1F 38%,#FF5B1F 68%,#E0231A)
display     Archivo 900 / -0.045em
body        Inter 400 / 1.70
label       Space Mono 700 / uppercase / 0.18em
radius      interactive 100px · panels 44-48px · never 0 on a container
```

### Example prompts
- "Hero on `#0A0705`, Archivo 900 clamp(3.2rem,9vw,8rem), tracking -0.045em, gradient text
  `#FFF6EC → #FFD447 → #FF8A1F`, split-char GSAP reveal, ember particles behind, no container."
- "Project panel: `linear-gradient(160deg,#1F1811,#14100C)`, **48px radius, no border**,
  inner radial glow tinted by project color, 2px gradient top-edge bar, title Archivo 800 1.75rem."
- "Metric: Archivo 900 3.2rem flame-gradient number + Space Mono 0.7rem uppercase `#6E5B4C`
  label, floating in whitespace with **no box around it**."
- "Nav: fixed, `rgba(10,7,5,.62)` + blur(18px), hairline gradient bottom (no solid border),
  pill flame CTA at right."

### Iteration guide
1. Is it warm? Cool gray or pure white means wrong.
2. Is anything framed? Remove the border, add a glow.
3. Is the corner radius ≥ 44px on panels and 100px on interactives?
4. Is the color inside the fire scale? Purple/neon = reject.
5. Is there motion? Every section should enter, and decor should never sit still.
