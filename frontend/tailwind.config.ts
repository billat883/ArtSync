import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF3CAC", // neon pink
        techblue: "#2BD2FF", // cyan
        midnight: "#0B1020",
        ink: "#0F1226",
      },
      backgroundImage: {
        'gradient-web3': 'linear-gradient(135deg, #FF3CAC 0%, #2BD2FF 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;


