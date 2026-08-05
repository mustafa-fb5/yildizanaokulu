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
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde047',
          300: '#facc15',
          400: '#eab308',
          500: '#ca8a04',
          600: '#a16207',
          700: '#854d0e',
          800: '#713f12',
          900: '#582c0f',
        },
        yildiz: {
          blue: '#1e3a8a',
          sky: '#0284c7',
          yellow: '#f59e0b',
          rose: '#e11d48',
          purple: '#7c3aed',
          teal: '#0d9488',
        }
      },
    },
  },
  plugins: [],
};
export default config;
