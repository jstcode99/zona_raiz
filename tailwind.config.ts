import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans'", "sans-serif"],
      },
      backgroundImage: {
        'texture-pattern': "url('./images/gray-abstract-wireframe-technology-background.png')",
      }
    },
  },
  plugins: [
  ],
};

export default config;
