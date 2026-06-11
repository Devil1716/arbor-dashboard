/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'bevel': 'inset 0 2px 0 0 rgba(255,255,255,0.1), inset 0 -2px 0 0 rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.4)',
        'bevel-pressed': 'inset 0 4px 8px rgba(0,0,0,0.6), inset 0 0 4px rgba(0,0,0,0.4)',
        'panel': '0 -2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'screen': 'inset 0 4px 15px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
      },
    },
  },
  plugins: [],
}

