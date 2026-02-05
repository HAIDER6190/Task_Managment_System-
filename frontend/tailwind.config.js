/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#4f7cff", // Hardcoded to support opacity modifiers
          dark: "#3d6ae8",
          light: "#6b8fff",
        },
        // Removed generic 'secondary' to avoid collisions. Use specific semantic names.
        accent: {
          DEFAULT: "#4f7cff",
          dark: "#3d6ae8",
        },
        danger: "#ef4444",
        success: "#22c55e",
        warning: "#f59e0b",
        dark: {
          900: "#14161b",
          800: "#1a1d24",
          700: "#1f232b",
          600: "#282d38",
          500: "#343a47",
        },
        // Common semantic colors
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
          overlay: "rgba(31, 35, 43, 0.95)",
        },
        border: "var(--color-border)",
      },
      textColor: {
        primary: "var(--color-text-primary)", // text-primary
        secondary: "var(--color-text-secondary)", // text-secondary
        muted: "var(--color-text-muted)", // text-muted
        "primary-themed": "var(--color-text-primary)", // Alias for compatibility
        "secondary-themed": "var(--color-text-secondary)",
        "muted-themed": "var(--color-text-muted)",
      },
      backgroundColor: {
        main: "var(--color-bg)", // bg-main
        secondary: "var(--color-bg-secondary)", // bg-secondary
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%)',
        'gradient-card': 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg-secondary) 100%)',
        'gradient-surface': 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg) 100%)',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.15)',
        'card': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        'elevated': '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
        'focus': '0 0 0 3px rgba(79, 124, 255, 0.25)',
      },
      borderRadius: {
        'DEFAULT': '0.625rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
