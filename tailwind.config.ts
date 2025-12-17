import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#1D8ADC',
              foreground: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#02734A',
              foreground: '#FFFFFF',
            },
            success: {
              DEFAULT: '#00B161',
              foreground: '#FFFFFF',
            },
            background: '#FFFFFF',
            foreground: '#0C2A46',
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#1D8ADC',
              foreground: '#020617',
            },
            secondary: {
              DEFAULT: '#00B161',
              foreground: '#020617',
            },
            background: '#0C2A46',
            foreground: '#E5E7EB',
          },
        },
      },
    }),
  ],
};

export default config;
