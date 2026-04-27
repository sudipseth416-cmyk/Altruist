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
          950: "#04060e",
          900: "#080c18",
          800: "#0c1225",
          700: "#131b36",
          600: "#1a2547",
          500: "#243058",
        },
        "ngo-accent": {
          DEFAULT: "#34d399",
          light: "#6ee7b7",
          dark: "#059669",
        },
        "ngo-cyan": {
          DEFAULT: "#06d6f2",
          light: "#67e8f9",
          dark: "#0891b2",
        },
        "ngo-blue": {
          DEFAULT: "#3b82f6",
          light: "#93c5fd",
          dark: "#2563eb",
        },
        "ngo-purple": {
          DEFAULT: "#a855f7",
          light: "#c084fc",
          dark: "#7c3aed",
        },
        "ngo-pink": {
          DEFAULT: "#ec4899",
          light: "#f472b6",
          dark: "#db2777",
        },
        "ngo-amber": {
          DEFAULT: "#f59e0b",
          light: "#fcd34d",
          dark: "#d97706",
        },
        "ngo-rose": {
          DEFAULT: "#f43f5e",
          light: "#fb7185",
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
        "slide-up-slow": "slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "slide-left": "slideLeft 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "gradient-shift": "gradientShift 6s ease infinite",
        "gradient-drift": "gradientDrift 8s ease infinite",
        "gradient-rotate": "gradientRotate 10s linear infinite",
        "counter": "counter 1.5s ease-out forwards",
        "progress": "progressBar 1.2s ease-out forwards",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "shimmer-sweep": "shimmerSweep 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "radar": "radarSweep 4s linear infinite",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "draw-line": "drawLine 1.5s ease-out forwards",
        "bar-grow": "barGrow 1s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "glow-pulse-multi": "glowPulseMulti 3s ease-in-out infinite",
        "blink-critical": "blinkCritical 1s ease-in-out infinite",
        "blink-amber": "blinkAmber 1.5s ease-in-out infinite",
        "view-enter": "viewEnter 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "stagger-1": "fadeIn 0.5s ease-out 0.05s forwards",
        "stagger-2": "fadeIn 0.5s ease-out 0.1s forwards",
        "stagger-3": "fadeIn 0.5s ease-out 0.15s forwards",
        "stagger-4": "fadeIn 0.5s ease-out 0.2s forwards",
        "stagger-5": "fadeIn 0.5s ease-out 0.25s forwards",
        "stagger-6": "fadeIn 0.5s ease-out 0.3s forwards",
        "grid-pulse": "gridPulse 4s ease-in-out infinite",
        "marker-bounce": "markerBounce 2s ease-in-out infinite",
        "flow-line": "flowLine 2s linear infinite",
        "border-glow": "borderGlow 4s ease-in-out infinite",
        "aurora": "aurora 12s ease-in-out infinite",
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
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(6, 214, 242, 0.2)" },
        },
        glowPulseMulti: {
          "0%": { boxShadow: "0 0 20px rgba(6, 214, 242, 0.15)" },
          "33%": { boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)" },
          "66%": { boxShadow: "0 0 30px rgba(236, 72, 153, 0.15)" },
          "100%": { boxShadow: "0 0 20px rgba(6, 214, 242, 0.15)" },
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
        gradientDrift: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        gradientRotate: {
          "0%": { backgroundPosition: "0% 50%" },
          "25%": { backgroundPosition: "100% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "75%": { backgroundPosition: "0% 100%" },
          "100%": { backgroundPosition: "0% 50%" },
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
        shimmerSweep: {
          "0%": { left: "-100%", opacity: "0" },
          "50%": { opacity: "0.6" },
          "100%": { left: "200%", opacity: "0" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        barGrow: {
          "0%": { transform: "scaleY(0)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(1)", transformOrigin: "bottom" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(6, 214, 242, 0.2)" },
          "50%": { boxShadow: "0 0 24px rgba(168, 85, 247, 0.4)" },
        },
        blinkCritical: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        blinkAmber: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        viewEnter: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        gridPulse: {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.07" },
        },
        markerBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        flowLine: {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(6, 214, 242, 0.15)" },
          "33%": { borderColor: "rgba(168, 85, 247, 0.2)" },
          "66%": { borderColor: "rgba(236, 72, 153, 0.15)" },
        },
        aurora: {
          "0%": { transform: "translateX(-50%) translateY(-50%) rotate(0deg) scale(1)" },
          "33%": { transform: "translateX(-30%) translateY(-60%) rotate(120deg) scale(1.1)" },
          "66%": { transform: "translateX(-60%) translateY(-40%) rotate(240deg) scale(0.9)" },
          "100%": { transform: "translateX(-50%) translateY(-50%) rotate(360deg) scale(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
