import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'

// SITE: dominio canónico. Se usa en canonical, hreflang, sitemap y JSON-LD.
// Cámbialo aquí cuando tengas el dominio definitivo.
const SITE = 'https://carolinadev.vercel.app'

export default defineConfig({
  site: SITE,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en' } },
    }),
    robotsTxt(),
  ],
})
