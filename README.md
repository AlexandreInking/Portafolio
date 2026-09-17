# Portafolio — Alejandro Espinoza López

Landing page personal optimizada para **marketing digital y diseño gráfico**.
Tema oscuro cálido con paleta de fuego, animada con GSAP, sin cajas ni bordes,
lista para **GitHub Pages**.

```
index.html                  La landing completa
DESIGN.md                   Sistema de diseño (IGNIS) — leer antes de tocar estilos
Proyectos.xlsx              ← TU ARCHIVO: agrega filas y la web se actualiza sola
data/projects.json          Respaldo para abrir la web en local (file://)
assets/css/style.css        Estilos
assets/js/main.js           Animaciones GSAP + interacción
assets/js/projects.js       Lector del Excel (SheetJS) + render de proyectos
assets/vendor/gsap/         GSAP 3 (core, ScrollTrigger, ScrollTo, SplitText, CustomEase)
assets/vendor/xlsx/         SheetJS — lee Proyectos.xlsx en el navegador
tools/xlsx_to_json.py       Excel -> JSON (solo para preview local)
tools/_make_xlsx.py         Regenera la plantilla Proyectos.xlsx
.nojekyll                   Imprescindible para GitHub Pages
```

---

## Cómo actualizar los proyectos

1. Abre **`Proyectos.xlsx`**.
2. Agrega **una fila por proyecto** (o rellena los links de _Spark_).
3. Guarda y sube el archivo a GitHub.

**Eso es todo.** La página lee el Excel directamente en el navegador, así que
los cambios aparecen solos. No hay que tocar código ni ejecutar nada.

### Columnas

| Columna | Qué va ahí |
|---|---|
| `Proyecto` | Nombre que se muestra grande |
| `Rol` | Tu cargo en el proyecto |
| `Descripción` | Texto de la ficha (en clave marketing: qué hiciste y para qué) |
| `Categoría` | Etiqueta corta, ej. `Videojuego · PC` |
| `Estado` | `Publicado` / `En desarrollo` / `Concepto` |
| `Año` | `2026` |
| `Link GitHub` | URL del repo. **Vacío = el botón no aparece** |
| `Link Demo` | itch.io, web o descarga. **Vacío = el botón no aparece** |
| `Texto Demo` | *(opcional)* rótulo del botón de demo. Por defecto `Ver / jugar`. Ej: `Ver la herramienta`, `Jugar` |
| `Tags` | Separados por coma: `Unity 3D,Dirección de arte` |
| `Destacado` | `SI` aparece primero y más grande · `NO` tamaño normal |
| `Color` | Hex de la paleta: `#FFD447` · `#FF8A1F` · `#FF5B1F` · `#E0231A` |
| `Orden` | Número; el menor aparece primero |

> Cuando le pongas link a **Spark**, solo pégalo en su fila: el botón se activa solo.

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

Con servidor (recomendado — así funciona la lectura del Excel):

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

Si abres `index.html` con doble clic, el navegador bloquea leer el `.xlsx`.
En ese caso la web usa `data/projects.json`. Para regenerarlo tras editar el Excel:

```bash
pip install openpyxl
python tools/xlsx_to_json.py
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
