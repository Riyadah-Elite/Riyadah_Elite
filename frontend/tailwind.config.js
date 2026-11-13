
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
      },
    },
  },

  plugins: [],
};
