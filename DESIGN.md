# DESIGN.md — Portfolio v2 (rama `feat/redesign-v2`)

Estado: **IMPLEMENTADO (opción A)**. Pendiente: datos de MadRing Guide, captura de Stibios, dominio final y revisión del inglés.

## 0. Referencia medida (rubenbupe.com, extraída del CSS/HTML publicado)
- Tema: fondo `hsl(210 11% 4%)` ≈ #090a0b; superficies #0d0e10 / #16171a; texto #e6e8eb / #f2f3f5; grises #8e949c, #6f747c.
- Tipografías: Cal Sans (display) + Instrument Serif Italic (acento) + mono del sistema.
- Easings: `cubic-bezier(.22,1,.36,1)` (ease-out-expo, entrada "rise" 1.1 s), `(.4,0,.2,1)` (por defecto, 150 ms), `(0,0,.2,1)`.
- Duraciones: hover 150 ms, expansión 300–500 ms, marquee 60 s lineal, entrada 450–1100 ms; respeta reduced-motion.
- Contenedores: hasta 72rem. Marquee del stack separado por ✦; ficha mono Nombre/Rol/Base.
- Lo que NO tomo: sus fuentes, sus textos, su paleta gris-azulada, el ✦, la tarjeta terminal ni su layout.
Observaciones del brief:
Astro + View Transitions, fondo casi negro (#090a0b), hero con nombre tracking abierto + ficha mono,
marquees, lista numerada de áreas, timeline con tarjetas que se expanden, mockups con marco de navegador,
copiar email con confirmación, tono humano y directo.
Cuando haya acceso (o capturas), se añade aquí una tabla "referencia medida" y se contrasta.
Regla: inspiración de calidad y espíritu, no copia de textos, imágenes, nombre ni layout.

## 1. Dos direcciones

### A. "Línea Madrid" (recomendada)
Idea única: **un mapa de metro de un sistema**. Tu trabajo es conectar cosas (interfaz, API, datos, agentes,
despliegue) y el metro es la metáfora visual más madrileña que existe de "red que funciona a diario".
- Hero: un plano de línea con estaciones (Idea, Interfaz, API, Agente, Producción). Un punto (el tren) recorre
  la línea y se detiene en cada estación mostrando una frase corta de lo que haces ahí. Pasas el ratón / tocas
  una estación y el tren va hasta ella. Es el momento característico; el resto, quieto y disciplinado.
- Por qué encaja: muestra full stack de punta a punta, la IA es una estación más y no el titular único.
- Riesgo: parecer un diagrama frío. Mitigación: copy cálido y una sola animación.

### B. "Teletipo de agentes"
Idea única: un **télex / terminal de despacho** donde los agentes "dictan" lo que hacen.
- Hero: un feed que se escribe línea a línea con eventos de ejemplo (marcados como ejemplo).
- Por qué encaja: IA, agentes, tiempo real. Riesgo: cercano al tópico "terminal de dev" y a un hero con IA en primer plano,
  que es justo lo que quieres evitar (que parezca solo IA).

**Elección: A.** Si prefieres B, se cambia solo el hero y la tipografía display.

## 2. Tokens (propuesta mía, ajustable)
Color (modo oscuro por defecto; no hay claro salvo que lo pidas)
- `--noche:   #0A0C10` fondo
- `--asfalto: #12161D` superficies
- `--riel:    #262C37` líneas y bordes
- `--papel:   #E9E6DE` texto principal (contraste AA sobre noche)
- `--niebla:  #9AA3B2` texto secundario (AA sobre noche)
- `--ambar:   #F2A33A` único acento (señalética, estación activa, CTA)
- `--en-vivo: #3DD6B0` solo para estados "en producción / activo"
Sin morados, sin degradados decorativos.

Tipografía (2 familias, distintas, con ñ y acentos completos)
- Display/títulos: **Familjen Grotesk** (variable, carácter de señalética). Títulos en frase con punto final.
- Texto + datos: **Geist Mono** solo para ficha técnica y chips; el cuerpo en **Familjen Grotesk** 400.
  (Si el cuerpo en grotesca cansa, alternativa: Newsreader para lectura larga del blog.)
- Escala: base 17 px, razón 1.25 → 17 / 21 / 26 / 33 / 41 / 52 / 65. Línea de texto 62–68ch, interlínea 1.6.

Movimiento
- Easing propio `cubic-bezier(.2,.7,.2,1)`; 160 ms (hover), 320 ms (expandir), 700 ms (tren en el hero).
- Una sola animación orquestada al cargar (el tren). View Transitions entre páginas.
- `prefers-reduced-motion`: el tren se coloca en su estación sin recorrido.
- Nada de fade-and-slide en cada sección.

Layout
- Alineado a la izquierda, rejilla de 12 columnas, ancho máx. 1200 px, gutter fluido.
- Secciones como filas/listas y marcos de navegador; **no** rejilla de tarjetas iguales.
- Numeración solo donde hay secuencia real (las 6 áreas no son secuencia: se marcan con estaciones, no con 1–6).

## 3. Detalles de personalidad propios (no copiados)
- Ficha técnica en mono con "Última parada: Madrid".
- El botón de copiar email dice "Copiado. Buen viaje." al confirmar.
- Cada estación del hero tiene un cartel con su "línea" (Frontend, Backend, IA, Despliegue).
- Pie: "Hecho en Madrid, sin prisa y sin plantillas." y "Volver a cabecera" en lugar de "Volver arriba".

## 4. Estructura y rutas
`/` (es, por defecto) y `/en`. i18n nativo de Astro; textos en `src/i18n/es.json` y `en.json`.
Traducción EN marcada con `<!-- PENDIENTE DE REVISIÓN: inglés -->`. El blog se descartó; queda como idea un apartado técnico con casos de estudio.
1 Hero · 2 Marquee de stack · 3 Sobre mí + 6 áreas · 4 Experiencia (timeline expandible) · 5 Proyectos (marco de navegador) · 6 Contacto + footer. (El bloque «Puedo ayudarte con» va tras el marquee.)

## 5. Reglas de contenido
- "Stibios" = marca personal de producto independiente. Nunca "empresa", "compañía" ni "S.L.".
- Sin métricas inventadas. Todo dato de proyecto sale de lo que confirmes.
- Empleo actual: Lead Frontend en CSS Connection Soft Service (CV: ene. 2026 – presente).

## 6. Criterios de verificación (por sección, 375 px y 1440 px, es y en)
Contraste AA, foco visible, skip link, `lang` correcto, hreflang es/en, sitemap, OG, JSON-LD Person,
imágenes webp/avif, Lighthouse > 95 en las 4 categorías, reduced-motion respetado.

## 7. Implementación (resumen)
- Astro 4.4 + Tailwind 3 + i18n nativo (es en `/`, en `/en`), diccionarios `src/i18n/es.json` y `en.json` (tipados: si difieren, no compila).
- Hero: mapa de línea interactivo (`LineMap.astro`), un único recorrido al cargar; reduced-motion lo coloca en la última estación.
- SEO: canonical, hreflang es/en/x-default, OG, sitemap con i18n, JSON-LD Person. `SITE` en `astro.config.mjs`.
- Fuentes autoalojadas (Fontsource) e imágenes con `astro:assets` (webp).
- Lighthouse: sin medir todavía.
