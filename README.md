# Portfolio de Carolina Rodríguez

Portfolio personal de Carolina Rodríguez, Full Stack Developer & AI Engineer en Madrid.
Está en español (`/`) y en inglés (`/en`).

## Stack

- [Astro](https://astro.build) 4 con View Transitions y rutas i18n nativas
- Tailwind CSS 3 y TypeScript
- Fuentes autoalojadas con Fontsource (Familjen Grotesk y Geist Mono)
- Imágenes optimizadas con `astro:assets` y `sharp` (webp)
- Sitemap con hreflang, `robots.txt` y JSON-LD de tipo Person

## Desarrollo

Requiere Node 18+ y [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # servidor local en http://localhost:4321
pnpm build      # astro check + build en dist/
pnpm preview    # sirve el build
```

## Estructura

```
src/
  components/   Hero, LineMap (mapa de línea), Lanyard (tarjeta colgante), Help, About,
                Experience, Work, Contact, Header, Footer...
  i18n/         es.json, en.json e index.ts con el tipado de los textos
  layouts/      Layout.astro (SEO, hreflang, JSON-LD, View Transitions)
  pages/        / (es) y /en
  styles/       global.css (Tailwind)
DESIGN.md       dirección de diseño y tokens (paleta, tipografía, movimiento)
```

## Contenido

- **Textos:** todos están en `src/i18n/es.json` y `en.json`. Si el inglés no tiene la misma
  forma que el español, el build falla. La traducción al inglés está pendiente de revisión.
- **Proyectos y experiencia:** también salen de los diccionarios (`work` y `experience`).
- **Dominio:** cámbialo en la constante `SITE` de `astro.config.mjs`. Lo usan el sitemap,
  las URLs canónicas, hreflang y el JSON-LD.
- **Audio de presentación:** deja `presentacion.es.mp3` y/o `presentacion.en.mp3` en `src/assets/audio/`.
  El botón «Escúchame» del hero aparece solo en los idiomas que tengan archivo. Para añadir la
  transcripción, rellena `listen.text` en `es.json` / `en.json`.
- **CV:** `public/cv-carolina-rodriguez.pdf`.

## Despliegue

Es un sitio estático (`dist/`) pensado para Vercel. Fija `sitemap@7.1.1` con un override
de pnpm en `package.json` porque versiones posteriores rompen el build.

## Créditos y licencia

El repositorio nació a partir de la plantilla de [midudev](https://github.com/midudev).
El diseño y el código actuales están reescritos, pero se mantiene la licencia original,
[CC BY-NC 4.0](LICENSE.md): puedes inspirarte y reutilizar con atribución, sin uso comercial.
