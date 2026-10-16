/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that can contain NativeWind classNames must be listed here,
  // otherwise the classes are not generated. `src/**` covers routes, components,
  // hooks and the lib folder.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};