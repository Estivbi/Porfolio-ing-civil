/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,md,mdx}'],
  theme: {
    extend: {
      colors: {
        noche: '#0a0c10',
        asfalto: '#12161d',
        riel: '#262c37',
        papel: '#e9e6de',
        niebla: '#9aa3b2',
        ambar: '#f5b50a',
        envivo: '#3dd6b0',
      },
      fontFamily: {
        sans: ['"Familjen Grotesk Variable"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      // escala 17px · razón 1.25
      fontSize: {
        s0: ['1.0625rem', { lineHeight: '1.6' }],
        s1: ['1.3125rem', { lineHeight: '1.4' }],
        s2: ['1.625rem', { lineHeight: '1.25' }],
        s3: ['2.0625rem', { lineHeight: '1.15' }],
        s4: ['2.5625rem', { lineHeight: '1.1' }],
        s5: ['3.25rem', { lineHeight: '1.05' }],
        s6: ['4.0625rem', { lineHeight: '1' }],
      },
      maxWidth: { page: '75rem' },
      transitionTimingFunction: { linea: 'cubic-bezier(.2,.7,.2,1)' },
    },
  },
  plugins: [],
}
