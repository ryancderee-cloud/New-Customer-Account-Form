import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        seed: {
          green: '#2f6a4f',
          dark: '#12312a',
          cream: '#f7f7f2'
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
