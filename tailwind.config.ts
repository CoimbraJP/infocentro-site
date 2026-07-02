import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--color-black)",
        primary: "var(--color-primary)",
        white: "var(--color-white)",
        surface: "var(--color-surface)",
        accent1: "var(--color-accent1)",
        accent2: "var(--color-accent2)",
      },
    },
  },
  plugins: [],
};
export default config;
