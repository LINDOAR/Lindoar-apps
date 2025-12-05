
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        berry: {
          '500': '#f43f5e',
          '200': '#fecdd3',
          '100': '#ffe4e6',
        },
        mint: '#22c55e',
        peach: '#f97316',
        sky: '#0ea5e9',
        stone: '#78716c',
        cream: '#FFFCF8',
      },
      fontFamily: {
        'serif': ['"DM Serif Display"', 'serif'],
        'sans': ['Quicksand', 'sans-serif'],
      },
      boxShadow: {
        'berry-soft': '0 10px 25px -5px rgba(244, 63, 94, 0.2), 0 8px 10px -6px rgba(244, 63, 94, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
