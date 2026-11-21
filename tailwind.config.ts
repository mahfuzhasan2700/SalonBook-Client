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
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        gold: {
          50: '#fbf8ea',
          100: '#f5eecc',
          200: '#ebdc9b',
          300: '#dfc665',
          400: '#d5b13c',
          500: '#c59a27',
          600: '#aa7a1e',
          700: '#885a1b',
          800: '#71481c',
          900: '#603d1c',
        }
      },
    },
  },
  plugins: [],
};
export default config;
