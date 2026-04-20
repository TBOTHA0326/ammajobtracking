module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#84cc16',
        'primary-dark': '#65a30d',
        'primary-subtle': 'rgba(132,204,22,0.10)',
        sidebar: '#0c0d14',
        'sidebar-hover': 'rgba(255,255,255,0.05)',
        'sidebar-active': 'rgba(132,204,22,0.10)',
        bg: '#0f1117',
        surface: '#1a1d26',
        'surface-elevated': '#20242f',
        'text-primary': '#e2e8f0',
        'text-muted': '#64748b',
        border: 'rgba(255,255,255,0.07)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25)',
        'card-hover': '0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
        'card-sm': '0 1px 2px rgba(0,0,0,0.25)',
        primary: '0 1px 3px rgba(101,163,13,0.35)',
      },
      borderRadius: {
        card: '16px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '1.4' }],
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
