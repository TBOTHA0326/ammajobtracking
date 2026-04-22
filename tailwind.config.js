/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#f97316',
          dark: '#ea6a0a',
          subtle: 'rgba(249,115,22,0.12)',
        },
        sidebar: '#0c0e15',
        bg: '#0f1117',
        surface: '#161922',
        elevated: '#1e2230',
        border: 'rgba(255,255,255,0.07)',
      },
    },
  },
  plugins: [],
};
