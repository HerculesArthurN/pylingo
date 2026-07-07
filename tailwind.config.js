/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: {
            DEFAULT: '#58cc02',
            light: '#84d8ff', // ou usar cores de branding específicas
            dark: '#46a302',
            border: '#58cc02'
          },
          blue: {
            DEFAULT: '#1cb0f6',
            dark: '#1899d6',
            light: '#ddf4ff'
          },
          yellow: {
            DEFAULT: '#ffc800',
            dark: '#e6b400'
          },
          orange: {
            DEFAULT: '#ff9600',
            dark: '#e68500'
          },
          red: {
            DEFAULT: '#ff4b4b',
            dark: '#ea2b2b',
            light: '#ffd8d8'
          },
          purple: {
            DEFAULT: '#c879ff',
            dark: '#a560d4'
          },
          gray: {
            DEFAULT: '#afafaf',
            dark: '#777777',
            light: '#e5e5e5',
            extralight: '#f7f7f7'
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'duo-flat': '0 4px 0 0 var(--tw-shadow-color)',
        'duo-flat-lg': '0 6px 0 0 var(--tw-shadow-color)',
        'duo-flat-active': '0 0px 0 0 var(--tw-shadow-color)',
      }
    },
  },
  plugins: [],
}
