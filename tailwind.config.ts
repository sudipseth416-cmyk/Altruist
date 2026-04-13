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
        "ngo-dark": {
          950: "#060a14",
          900: "#0a0e1a",
          800: "#0f1629",
          700: "#161d35",
          600: "#1e2844",
          500: "#283354",
        },
        "ngo-accent": {
          DEFAULT: "#34d399",
          light: "#6ee7b7",
          dark: "#059669",
        },
        "ngo-cyan": {
          DEFAULT: "#22d3ee",
          light: "#67e8f9",
          dark: "#0891b2",
        },
        "ngo-blue": {
          DEFAULT: "#3b82f6",
          light: "#93c5fd",
          dark: "#2563eb",
        },
        "ngo-amber": {
          DEFAULT: "#fbbf24",
          light: "#fde68a",
          dark: "#d97706",
        },
        "ngo-rose": {
          DEFAULT: "#fb7185",
          light: "#fda4af",
          dark: "#e11d48",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-fast": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "gradient-shift": "gradientShift 6s ease infinite",
        "counter": "counter 1.5s ease-out forwards",
        "progress": "progressBar 1.2s ease-out forwards",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(52, 211, 153, 0.1)" },
          "50%": { boxShadow: "0 0 35px rgba(52, 211, 153, 0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        progressBar: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
