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
        base: {
          50: 'var(--color-base-50)',
          100: 'var(--color-base-100)',
          200: 'var(--color-base-200)',
          300: 'var(--color-base-300)',
          400: 'var(--color-base-400)',
          500: 'var(--color-base-500)',
          600: 'var(--color-base-600)',
          700: 'var(--color-base-700)',
          800: 'var(--color-base-800)',
          900: 'var(--color-base-900)',
          950: 'var(--color-base-950)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        sans: ['JetBrains Mono', 'Fira Code', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        pixel: ['"Press Start 2P"', 'cursive'], // Optional for mascot or specific titles
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,1)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'brutal': '4px 4px 0px 0px var(--color-base-900)',
        'brutal-active': '0px 0px 0px 0px var(--color-base-900)',
      }
    },
  },
  plugins: [],
}
