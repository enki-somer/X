import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(29, 155, 240)",
        secondary: "rgb(24, 24, 24)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
          secondary: "rgb(24, 24, 24)",
          "base-100": "#000000",
          "base-200": "#0a0a0a",
          "base-300": "#1a1a1a",
        },
      },
    ],
    darkTheme: "black",
    base: true,
    styled: true,
    utils: true,
  },
};
