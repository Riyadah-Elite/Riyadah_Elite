const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// `input` tells NativeWind which CSS file holds the Tailwind directives.
module.exports = withNativeWind(config, { input: "./src/global.css" });