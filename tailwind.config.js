/** @type {import('tailwindcss').Config} */
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
        ink: {
          950: '#0A0A0A',
          900: '#101010',
          850: '#161616',
          800: '#1C1C1C',
          700: '#262626',
          600: '#333333',
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
