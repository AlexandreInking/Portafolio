# Portafolio — Alejandro Espinoza López

Landing page personal optimizada para **marketing digital y diseño gráfico**.
Tema oscuro cálido con paleta de fuego, animada con GSAP, sin cajas ni bordes,
lista para **GitHub Pages**.

```
index.html                  La landing completa
DESIGN.md                   Sistema de diseño (IGNIS) — leer antes de tocar estilos
data/projects.json          ← TU ARCHIVO: edita los proyectos y la web se actualiza sola
assets/css/style.css        Estilos
assets/js/main.js           Animaciones GSAP + interacción
assets/js/projects.js       Render de proyectos desde el JSON
assets/vendor/gsap/         GSAP 3 (core, ScrollTrigger, ScrollTo, SplitText, CustomEase)
.nojekyll                   Imprescindible para GitHub Pages
```

---

## Cómo actualizar los proyectos

1. Abre **`data/projects.json`**.
2. Agrega o edita **un objeto por proyecto** (o rellena los links de _Spark_).
3. Guarda y sube el archivo a GitHub.

**Eso es todo.** La página lee el JSON directamente, así que
los cambios aparecen solos. No hay que tocar código ni ejecutar nada.

### Campos

| Campo | Qué va ahí |
|---|---|
| `name` | Nombre que se muestra grande |
| `role` | Tu cargo en el proyecto |
| `description` | Texto de la ficha (en clave marketing: qué hiciste y para qué) |
| `category` | Etiqueta corta, ej. `Videojuego · PC` |
| `status` | `Publicado` / `En desarrollo` / `Concepto` |
| `year` | `2026` |
| `github` | URL del repo. **Vacío = el botón no aparece** |
| `demo` | itch.io, web o descarga. **Vacío = el botón no aparece** |
| `demoLabel` | *(opcional)* rótulo del botón de demo. Por defecto `Ver / jugar`. Ej: `Ver la herramienta`, `Jugar` |
| `tags` | Lista de etiquetas: `["Unity 3D", "Dirección de arte"]` |
| `featured` | `true` aparece primero y más grande · `false` tamaño normal |
| `color` | Hex de la paleta: `#FFD447` · `#FF8A1F` · `#FF5B1F` · `#E0231A` |
| `order` | Número; el menor aparece primero |

> Cuando le pongas link a **Spark**, solo agrégalo en su objeto: el botón se activa solo.

---

## Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Portafolio: landing marketing + diseño"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Source: `Deploy from a branch` → Branch `main` → Folder `/ (root)` → Save**.

La web queda en `https://TU-USUARIO.github.io/TU-REPO/`.

> **Recomendación:** nombra el repo sin espacios ni tildes (`portafolio` o
> `mi-portafolio`). Un repo llamado `Mi portafolio` funciona, pero la URL se ve
> como `.../Mi%20portafolio/`.

`.nojekyll` ya está incluido: sin él, Jekyll rompe rutas de assets.

---

## Ver en local

Con servidor (recomendado):

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

---

## Diseño

Ver **`DESIGN.md`** antes de modificar estilos. Reglas duras:

- **Cero cajas**: nada de bordes alrededor del contenido. La separación se logra
  con espacio en blanco, glows radiales y tipografía.
- **Solo paleta de fuego**: blanco cálido → amarillo → naranja → rojo.
  Prohibido morado, violeta, cian, magenta, verde neón o azul eléctrico.
- **Interactivos siempre redondos**: `border-radius: 100px`.
- **Sin JS el contenido se ve igual**: los estados iniciales están bajo `.js`.

## Animación (GSAP)

Se instalaron las [GSAP AI Skills](https://github.com/greensock/gsap-skills)
oficiales (carpeta `skills/` del usuario) y GSAP está **vendorizado** en
`assets/vendor/gsap/`, así que la web no depende de un CDN.

Uso: timelines en lugar de `delay`, `autoAlpha` en lugar de `opacity`,
transform aliases (`x`/`y`/`scale`), y `ScrollTrigger` para los revelados.
Con `prefers-reduced-motion: reduce` las partículas desaparecen y los reveals
se vuelven instantáneos.
