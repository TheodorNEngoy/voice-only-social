import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./tests/**/*.{ts,tsx}", "./worker/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5c6ac4",
          dark: "#3346a0"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate"), plugin(({ addVariant }) => {
    addVariant("hocus", "&:hover, &:focus-visible");
  })]
};

export default config;
