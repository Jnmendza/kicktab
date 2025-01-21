/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // For Next.js
    "./components/**/*.{js,ts,jsx,tsx}", // For your components
    "./app/**/*.{js,ts,jsx,tsx}", // If you’re using the new app directory
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
