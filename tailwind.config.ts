import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        // Master Prompt Light/Dark Theme Tokens
        theme: {
          light: {
            page: '#FAF7F3',
            surface: '#FFFFFF',
            espresso: '#291F26',
            muted: '#675961',
            berry: '#80405A',
            berryHover: '#6a3449',
            border: '#EAE3DB',
          },
          dark: {
            ink: '#171316',
            charcoal: '#241E23',
            white: '#F8F1ED',
            muted: '#C8B8C0',
            rose: '#E2A5BA',
            roseHover: '#d88ea6',
            border: '#382E36',
          },
        },
        primary: {
          50: '#fdf4f7',
          100: '#faeaf0',
          200: '#f6d5e1',
          300: '#efb3c8',
          400: '#e288a8',
          500: '#cf6389',
          600: '#b8466e',
          700: '#80405A', // Official Theme Berry
          800: '#6d2a45',
          900: '#5c263c',
          950: '#3a1222',
        },
        roseDust: '#E2A5BA', // Official Theme Dark Primary
      },
      transitionDuration: {
        '180': '180ms',
      },
    },
  },
  plugins: [],
};
export default config;
