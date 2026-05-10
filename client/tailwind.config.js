/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef9ff',
          100: '#d8f1ff',
          200: '#b9e7ff',
          300: '#88d9ff',
          400: '#50c3fd',
          500: '#28a9fa',
          600: '#118def',
          700: '#0a74db',
          800: '#0f5db1',
          900: '#134f8c',
          950: '#0f3260',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark:    '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:   '0 2px 16px 0 rgba(0,0,0,0.08)',
        'card-dark': '0 2px 16px 0 rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
