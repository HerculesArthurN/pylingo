/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bioma: {
          sand: 'var(--color-bioma-sand)',
          'sand-dark': 'var(--color-bioma-sand-dark)',
          card: 'var(--color-bioma-card)',
          bark: 'var(--color-bioma-bark)',
          muted: 'var(--color-bioma-muted)',
          moss: 'var(--color-bioma-moss)',
          'moss-dark': 'var(--color-bioma-moss-dark)',
          leaf: 'var(--color-bioma-leaf)',
          'leaf-hover': 'var(--color-bioma-leaf-hover)',
          'leaf-light': 'var(--color-bioma-leaf-light)',
          amber: 'var(--color-bioma-amber)',
          'amber-soft': 'var(--color-bioma-amber-soft)',
          clay: 'var(--color-bioma-clay)',
          'clay-soft': 'var(--color-bioma-clay-soft)',
          border: 'var(--color-bioma-border)',
          focus: 'var(--color-bioma-focus)',
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'organic-sm': '12px 16px 12px 14px',
        'organic-md': '20px 24px 18px 22px',
        'organic-lg': '28px 32px 26px 30px',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(22, 51, 35, 0.08), 0 1px 3px -1px rgba(22, 51, 35, 0.04)',
        'warm-md': '0 8px 24px -4px rgba(22, 51, 35, 0.12), 0 2px 6px -1px rgba(22, 51, 35, 0.06)',
        'warm-3d': '0 6px 0 0 #15422B',
        'warm-3d-amber': '0 6px 0 0 #853E07',
        'warm-3d-active': '0 0px 0 0 #15422B',
      }
    },
  },
  plugins: [],
}
