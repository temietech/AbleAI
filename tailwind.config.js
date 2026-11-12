/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paypal: {
          blue: '#003087',
          sky: '#0079C1',
          light: '#009CDE',
          yellow: '#FFC439',
          gold: '#F4BB33',
        },
      },
    },
  },
  plugins: [],
}
