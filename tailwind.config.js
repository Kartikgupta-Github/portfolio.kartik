/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a", // Dark background
        primary: "#ff6b00", // Orange
        secondary: "#8b4513", // Brown
        glass: "rgba(255, 255, 255, 0.1)",
      }
    },
  },
  plugins: [],
}
