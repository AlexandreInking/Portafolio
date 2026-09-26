# Portafolio · Alejandro Espinoza López

Landing page personal optimizada para **marketing digital y diseño gráfico**.
Tema oscuro cálido con paleta de fuego, animada con GSAP, sin cajas ni bordes,
lista para **GitHub Pages**.

```
index.html                  La landing completa (textos en español + claves i18n)
DESIGN.md                   Sistema de diseño (IGNIS) · leer antes de tocar estilos
data/projects.json          ← TU ARCHIVO: edita los proyectos y la web se actualiza sola
assets/css/style.css        Estilos
assets/js/main.js           Animaciones GSAP + interacción
assets/js/projects.js       Render de proyectos desde el JSON
assets/js/i18n.js           Diccionarios ES/EN + motor de traducción
assets/js/lang.js           Dropdown de idiomas (ES por defecto · EN)
assets/vendor/gsap/         GSAP 3 (core, ScrollTrigger, ScrollTo, SplitText, CustomEase)
.nojekyll                   Imprescindible para GitHub Pages
```

---

## Idiomas (ES por defecto · EN)

La web está escrita en **español directamente en el HTML**, así que sin JS se ve
completa. Cada texto lleva una clave para poder traducirlo en caliente:

| Atributo | Para qué |
|---|---|
| `data-i18n="clave"` | Reemplaza el **texto** del elemento |
| `data-i18n-html="clave"` | Reemplaza el **HTML** interior (para textos con `<em>`, `<br>`…) |
| `data-i18n-attr="aria-label:clave, title:clave"` | Traduce **atributos** |

Los diccionarios viven en **`assets/js/i18n.js`** (`DICT.es` / `DICT.en`). Para
agregar un idioma: copia el bloque `en`, cámbialo y añade su código a
`SUPPORTED`.

**Orden de detección:** `?lang=en` en la URL → `localStorage` (`portafolio-lang`)
→ `<html lang>` → idioma del navegador → **español**.

- El selector en la nav (junto al botón de tema) cambia el idioma y lo recuerda.
  En móvil (≤ 1100px) **sigue en la barra superior** —como el tema y el trofeo— y además
  se repite dentro del menú desplegable, para que se pueda cambiar sin abrir el menú.
  `lang.js` conecta todas las instancias `.lang` del DOM, no solo la primera.
- Al cambiar, se emite el evento `i18n:changed` para que los módulos que pintan
  texto en JS (proyectos, palabras del hero, easter eggs, toasts) se actualicen solos.
- `window.I18N.t("clave")` traduce desde código; `window.I18N.set("en")` cambia el idioma.

---

## Cómo actualizar los proyectos

1. Abre **`data/projects.json`**.
2. Agrega o edita **un objeto por proyecto**.
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
| `status` | `Publicado` / `En desarrollo` (se traduce solo; el original manda el color) |
| `year` | `2026` |
| `github` | URL del repo. Aparece como chip "Repositorio". **Vacío = no aparece** |
| `demo` | itch.io, web o descarga. **Vacío = el botón no aparece** |
| `demoLabel` | *(opcional)* rótulo del botón de demo. Por defecto `Ver / jugar`. Ej: `Ver la herramienta`, `Jugar` |
| `tags` | Lista de etiquetas: `["Unity 3D", "Dirección de arte"]` |
| `featured` | `true` aparece primero y más grande · `false` tamaño normal |
| `color` | Hex de la paleta: `#FFD447` · `#FF8A1F` · `#FF5B1F` · `#E0231A` |
| `order` | Número; el menor aparece primero |

### Versión en inglés

Cada campo de texto admite un gemelo con sufijo **`_en`**. Si existe, se usa al
cambiar a inglés; si no, se muestra el texto en español.

```json
{
  "name": "TeatroPlayer",
  "role": "Producto, diseño y desarrollo",
  "role_en": "Product, design and development",
  "description": "…",
  "description_en": "…",
  "category": "Herramienta de escritorio",
  "category_en": "Desktop tool",
  "demoLabel": "Jugar",
  "demoLabel_en": "Play",
  "tags": ["Rust", "Audio en vivo"],
  "tags_en": ["Rust", "Live audio"]
}
```

Aplica a: `role_en`, `description_en`, `category_en`, `demoLabel_en`, `tags_en`.
El `name` no se traduce (es el título propio del proyecto).

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
- **Dos temas**: oscuro de fuego por defecto y claro Aqua (blanco, cian,
  celeste, azul y negro). Botón en la nav, se recuerda en `localStorage`.
- **Dos idiomas**: español por defecto e inglés. Selector en la nav (también en móvil,
  en la barra y dentro del menú), se recuerda en `localStorage` y acepta `?lang=en`
  para compartir un enlace en inglés.

## Animación (GSAP)

Se instalaron las [GSAP AI Skills](https://github.com/greensock/gsap-skills)
oficiales (carpeta `skills/` del usuario) y GSAP está **vendorizado** en
`assets/vendor/gsap/`, así que la web no depende de un CDN.

Uso: timelines en lugar de `delay`, `autoAlpha` en lugar de `opacity`,
transform aliases (`x`/`y`/`scale`), y `ScrollTrigger` para los revelados.
Con `prefers-reduced-motion: reduce` las partículas desaparecen y los reveals
se vuelven instantáneos.
