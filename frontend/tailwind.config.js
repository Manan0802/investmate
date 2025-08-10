

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
          DEFAULT: '#1d4ed8',
          hover: '#1e40af',
        },
        accent: {
          DEFAULT: '#0d9488',
          hover: '#0f766e',
        },
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#facc15',
        light: '#f8fafc',
        dark: '#0f172a',
        // This is the new color for cards in dark mode.
        'dark-surface': '#1e293b',
        'text-light': '#f1f5f9',
        'text-dark': '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
