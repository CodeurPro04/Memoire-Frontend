/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  safelist: [
    "ql-align-left",
    "ql-align-center",
    "ql-align-right",
    "ql-align-justify",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Bleu KOF-GO
          foreground: "hsl(var(--primary-foreground))", // Blanc pour texte sur primaire
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Gris Foncé KOF-GO
          foreground: "hsl(var(--secondary-foreground))", // Blanc cassé pour texte sur secondaire
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Or KOF-GO
          foreground: "hsl(var(--accent-foreground))", // Noir/Gris foncé pour texte sur accent
        },
        kofgo: {
          blue: {
            DEFAULT: "#003366", // Bleu KOF-GO Principal
            light: "#004080", // Variante plus claire si besoin
            dark: "#002244", // Variante plus foncée si besoin
          },
          gold: {
            DEFAULT: "#FFD700", // Or KOF-GO Principal
            light: "#FFEB80",
            dark: "#B8860B",
          },
          gray: {
            DEFAULT: "#333333", // Gris Foncé KOF-GO
            light: "#F5F5F5", // Gris Clair KOF-GO
            medium: "#808080", // Gris Moyen KOF-GO
          },
          white: "#FFFFFF",
          black: "#000000",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"], // Police principale
        serif: ["Merriweather", "serif"], // Police pour accents ou citations si besoin
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
