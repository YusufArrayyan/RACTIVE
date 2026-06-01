import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "apple-blue": "var(--accent)",
        "apple-blue-light": "var(--accent-light)",
        surface: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          elevated: "var(--bg-elevated)",
          glass: "var(--bg-glass)",
          hover: "var(--bg-hover)",
          active: "var(--bg-active)",
        },
        label: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          quaternary: "var(--text-quaternary)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        /* Legacy compat aliases */
        "ractive-black": "#070707",
        "ractive-dark": "var(--bg-secondary)",
        "ractive-white": "var(--text-primary)",
        "ractive-muted": "var(--text-tertiary)",
        "ractive-surface": "var(--bg-tertiary)",
        "ractive-border": "var(--border-default)",
        "electric-purple": "var(--purple)",
        "electric-purple-light": "var(--purple)",
        "neon-blue": "var(--accent)",
        "soft-cyan": "var(--cyan)",
        "neon-green": "var(--green)",
        "glow-pink": "var(--pink)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["Satoshi", "-apple-system", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        glass: "var(--shadow-glass)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
