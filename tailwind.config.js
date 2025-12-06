/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors - NEW ZINC-BASED SCHEME
        bg: {
          primary: '#09090b',      // zinc-950 (main background)
          surface: '#09090b',      // zinc-950 (same as primary)
          elevated: '#27272a',     // zinc-800 (hover states, buttons)
          card: '#18181b',         // zinc-900 (card/row background)
          hover: '#18181b',        // zinc-900 (for opacity variants)
          empty: '#18181b',        // zinc-900 (for opacity variants)
          cooked: '#18181b',       // zinc-900 (completed meals)
        },
        // Primary action colors - UPDATED TO RED-500/600
        primary: {
          DEFAULT: '#ef4444',      // red-500 (primary action)
          hover: '#dc2626',        // red-600 (primary action hover)
          active: '#b91c1c',       // red-700 (keep for active states)
          ring: '#ef4444',         // red-500 (for ring utilities)
        },
        // Text colors - NEW ZINC SCALE
        text: {
          primary: '#ffffff',      // white (primary text)
          secondary: '#a1a1aa',    // zinc-400 (secondary text)
          tertiary: '#71717a',     // zinc-500 (tertiary text, placeholders)
          placeholder: '#71717a',  // zinc-500 (placeholder text)
          disabled: '#52525b',     // zinc-600 (disabled text)
          cooked: '#a1a1aa',       // zinc-400 (cooked meal text - muted)
        },
        // Border colors - ZINC BORDERS
        border: {
          DEFAULT: '#27272a',      // zinc-800 (primary border)
          secondary: '#3f3f46',    // zinc-700 (hover state)
          hover: '#3f3f46',        // zinc-700 (same as secondary)
          checkbox: '#52525b',     // zinc-600 (checkbox border)
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',          // red-500 (matching primary)
        // Star rating color
        star: '#eab308',           // yellow-500
        // Cuisine badge colors (keep existing)
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
