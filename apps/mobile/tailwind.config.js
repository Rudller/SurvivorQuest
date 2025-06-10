/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FEFAE0',
          dark: '#0D1B2A',
        },
        primary: {
          DEFAULT: '#606C38',
          dark: '#1B263B',
        },
        secondary: {
          DEFAULT: '#283618',
          dark: '#415A77',
        },
        accent: {
          DEFAULT: '#DDA15E',
          dark: '#778DA9',
        },
        highlight: {
          DEFAULT: '#BC6C25',
          dark: '#E0E1DD',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}