/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        popover: "hsl(var(--popover))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      backgroundImage: {
        "auth-dark": "url('/images/auth-dark.png')",
        "auth-light": "url('/images/auth-light.png')",
      },
    },
  },
  plugins: [],
};