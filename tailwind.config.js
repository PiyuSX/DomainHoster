/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#9333ea', // purple-600
          DEFAULT: '#7e22ce', // purple-700
          dark: '#6b21a8', // purple-800
        },
        secondary: {
          light: '#f8fafc', // slate-50
          DEFAULT: '#f1f5f9', // slate-100
          dark: '#e2e8f0', // slate-200
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #9333ea, #6b21a8)',
        'gradient-light': 'linear-gradient(to right, #f8fafc, #f1f5f9)',
        'gradient-dark': 'linear-gradient(to right, #0f172a, #020617)',
      }
    },
  },
  plugins: [],
}