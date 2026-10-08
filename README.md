# Portfolio de Alejandro Hernández Fernández

Portfolio de Alejandro Hernández Fernández, Ingeniero de Caminos, Canales y Puertos en Madrid, con perfil de análisis de datos.
Está en español (`/`) y en inglés (`/en`). Sirve también como **plantilla de portfolio para ingenieros de caminos**:
cambiando los textos y la foto, vale para otra persona.

## Stack

- [Astro](https://astro.build) 4 con View Transitions y rutas i18n nativas
- Tailwind CSS 3 y TypeScript
- [three.js](https://threejs.org) para la grúa torre del hero (procedural, sin modelos ni marcas externas)
- Fuentes autoalojadas con Fontsource (Familjen Grotesk y Geist Mono)
- Imágenes optimizadas con `astro:assets` y `sharp` (webp)
- Sitemap con hreflang, `robots.txt` y JSON-LD de tipo Person

## Puesta en marcha

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
  components/   Hero, CraneHero (grúa 3D + credencial), LineMap (del dato a la decisión), About,
                Works (obras), Experience, Education, Contact, Header, Footer...
  scripts/      crane.ts: la grúa torre en three.js
  i18n/         es.json, en.json e index.ts con el tipado de los textos
  layouts/      Layout.astro (SEO, hreflang, JSON-LD, View Transitions)
  pages/        / y /en
  styles/       global.css (Tailwind)
```

## Adaptarlo a otra persona

- **Textos:** todos están en `src/i18n/es.json` y `en.json`. Si el inglés no tiene la misma
  forma que el español, el build falla. La traducción al inglés está pendiente de revisión.
- **Foto:** `src/assets/me.jpg`, retrato vertical 4:5. Si tienes una foto redonda, colócala sobre un fondo del color de la credencial (`#12161d`).
- **CV:** `public/cv-alejandro-hernandez.pdf` (cambia también la ruta en `Header.astro` y `Hero.astro`).
- **Imagen social:** `public/og.jpg` (1200×630).
- **Dominio:** cámbialo en la constante `SITE` de `astro.config.mjs`. Ahora es un marcador
  (`alejandrohernandez.example`). Lo usan el sitemap, las URLs canónicas, hreflang y el JSON-LD.
- **Contacto y redes:** `contact` en los diccionarios, y el enlace de LinkedIn en `Footer.astro` y `Layout.astro`.

## Despliegue en Vercel

Es un sitio estático (`dist/`).

1. Importa el repositorio en [Vercel](https://vercel.com/new). Detecta Astro solo.
2. Comprueba que el comando de build sea `pnpm build` y el directorio de salida `dist`.
3. Cuando tengas el dominio, cámbialo en `SITE` de `astro.config.mjs` (canonical, hreflang, sitemap y JSON-LD salen de ahí).

`package.json` fija `sitemap@7.1.1` con un override de pnpm porque versiones posteriores rompen el build.

## Créditos y licencia

El repositorio nació a partir de la plantilla de [midudev](https://github.com/midudev).
Se mantiene la licencia original, [CC BY-NC 4.0](LICENSE.md): puedes inspirarte y reutilizar
con atribución, sin uso comercial.
