/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FEFAE0', // tło light
          dark: '#0D1B2A',   // tło dark
        },
        primary: {
          DEFAULT: '#606C38', // główny akcent light
          dark: '#1B263B',   // główny akcent dark
        },
        secondary: {
          DEFAULT: '#283618', // drugi akcent light
          dark: '#415A77',   // drugi akcent dark
        },
        accent: {
          DEFAULT: '#DDA15E', // akcent/przycisk light
          dark: '#778DA9',   // akcent/przycisk dark
        },
        highlight: {
          DEFAULT: '#BC6C25', // dodatkowy akcent light
          dark: '#E0E1DD',   // dodatkowy akcent dark
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
