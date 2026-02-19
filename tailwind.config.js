
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0f1715',
          light: '#e0ede4',
          accent: '#e63946',
          basket: '#f4a261',
          calcio: '#2a9d8f',
          anime: '#a29bfe'
        }
      },
      backgroundImage: {
        'dots': 'radial-gradient(circle, rgba(15, 23, 21, 0.1) 1px, transparent 1px)',
        'grid': 'linear-gradient(to right, rgba(15, 23, 21, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 21, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-size': '24px 24px',
        'grid-size': '60px 60px',
      }
    },
  },
  plugins: [],
}
