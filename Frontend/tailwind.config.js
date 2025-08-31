/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#1a1a1a', // Add dark color since you're using bg-dark
      }
    },
  },
  plugins: [],
}