/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // rgb(var(--x) / <alpha-value>) keeps the /60, /10 opacity modifiers
        // working while letting .dark flip the underlying value in index.css.
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          300: '#79C6B4',
          500: '#1F8A70',      // primary — eucalyptus green, same in both themes
          600: '#166B57',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
          900: '#0A342B',
        },
        clay: {
          400: '#E98A5B',      // ochre/clay accent — sparingly, for CTAs & alerts
          500: '#DD703C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
