/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        bg: {
          primary: '#0a0a0a',
          surface: '#1a1a1a',
          elevated: '#262626',
          cooked: '#0f0f0f',
          card: '#1e1e1e',
        },
        // Primary red colors
        primary: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          active: '#991b1b',
        },
        // Text colors
        text: {
          primary: '#fafafa',
          secondary: '#a3a3a3',
          disabled: '#525252',
          cooked: '#a3a3a3',
        },
        // Border colors
        border: {
          DEFAULT: '#404040',
          hover: '#525252',
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        // Cuisine badge colors
        cuisine: {
          italian: '#dc2626',
          asian: '#f59e0b',
          bulgarian: '#10b981',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 2px 8px 0 rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        DEFAULT: '8px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'checkmark': {
          '0%': { opacity: '0', transform: 'scale(0.5) rotate(-45deg)' },
          '50%': { opacity: '1', transform: 'scale(1.1) rotate(0deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'checkmark': 'checkmark 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
