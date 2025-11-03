/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // 🚨 THIS PLUGIN IS REQUIRED FOR PROSE STYLING TO WORK
  plugins: [
    require('@tailwindcss/typography'), 
  ],
}