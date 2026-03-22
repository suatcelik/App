/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./index.ts",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1a4a6e",
        secondary: "#2d7d9a",
        accent: "#f4a261",
        surface: "#0f2d47",
        gold: "#d4af37",
      },
      fontFamily: {
        arabic: ["serif"],
      },
    },
  },
  plugins: [],
};
