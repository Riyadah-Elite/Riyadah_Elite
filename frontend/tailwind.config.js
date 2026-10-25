/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that can contain NativeWind classNames must be listed here,
  // otherwise the classes are not generated. `src/**` covers routes, components,
  // hooks and the lib folder.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#F8FCFF",
          cyanPale: "#A5F3FC",
          cyanAction: "#0891B2",
          cyanDark: "#0E7490",
          blueLight: "#EFF6FF",
          violet: "#8B5CF6",
          mint: "#D1FAE5",
          warm: "#FFEDD5",
          text: "#172B3A",
          muted: "#5B7083",
        },
      },
    },
  },
  plugins: [],
};