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
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
          light: "#3b82f6",
        },
        secondary: {
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
          light: "#8b5cf6",
        },
        accent: {
          DEFAULT: "#06b6d4",
          dark: "#0891b2",
        },
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#ea580c",
        dark: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 27, 75, 0.6) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': '0 4px 24px 0 rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.4)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
