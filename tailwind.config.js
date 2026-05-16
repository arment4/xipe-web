/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C6F24E',
          dark: '#A8E000',
          dim: '#9bbf3a',
        },
        // dark text that sits on the lime brand color — constant in every theme
        brandink: '#0A0A0A',
        // page background outside the phone frame
        page: v('--page'),
        // brand accent for TEXT — readable green that darkens in light mode
        accent: v('--accent'),
        // foreground / body text — flips per theme
        fg: v('--fg'),
        // surfaces (was the fixed dark "ink" scale) — flips per theme
        ink: {
          950: v('--s0'),
          900: v('--s1'),
          850: v('--s2'),
          800: v('--s3'),
          700: v('--s4'),
          600: v('--s4'),
        },
        // muted text — flips per theme
        neutral: {
          300: v('--m1'),
          400: v('--m2'),
          500: v('--m3'),
          600: v('--m4'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(198,242,78,0.45)',
      },
    },
  },
  plugins: [],
}
