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
      borderRadius: {
        DEFAULT: '4px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      }
    },
  },
  plugins: [],
}
