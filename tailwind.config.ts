import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // enables dark mode via class="dark"
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // if you're using src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
