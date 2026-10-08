# DESIGN.md — Portfolio de Ingeniero de Caminos

## Idea
Una **obra con grúa**. En el hero, una grúa torre en 3D (three.js, procedural, sin marca) de cuyo gancho cuelga
la acreditación profesional con la foto. La cuerda tiene física: se puede arrastrar y la credencial se balancea
y sigue al gancho cuando el carro de la grúa se desplaza.
Debajo, "del dato a la decisión" (Datos, Análisis, Control, Automatización, Decisión) sustituye al mapa de metro. El enfoque del perfil es el análisis de datos aplicado a infraestructuras.

## Tokens
- `noche #0A0C10` fondo · `asfalto #12161D` superficies · `riel #262C37` líneas
- `papel #E9E6DE` texto · `niebla #9AA3B2` texto secundario
- `ambar #F5B50A` único acento (amarillo de seguridad, el de la grúa)
- Tipografía: Familjen Grotesk (texto y títulos) y Geist Mono (fichas y chips).
- Movimiento: `cubic-bezier(.2,.7,.2,1)`; `prefers-reduced-motion` deja la credencial quieta y la grúa en reposo.

## Secciones
Hero · Marquee de áreas · Sobre mí · Obras (presupuesto, cliente y papel) · Experiencia (timeline expandible) ·
Formación · Contacto. Sin blog ni proyectos propios.

## Reglas de contenido
- Todo dato sale del CV. Sin métricas inventadas.
- Los importes de las obras son los que figuran en el CV.

## Pendiente
- Dominio y revisión del inglés.
- Animación de un camión al hacer scroll (fase 2).
