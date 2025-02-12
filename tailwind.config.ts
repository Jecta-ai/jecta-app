import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        neonBlink: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 100, 255, 0.7)',
            borderColor: 'rgba(0, 0, 200, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 100, 255, 1)',
            borderColor: 'rgba(0, 0, 100, 1)',
          },
        },
      },
      animation: {
        neonBlink: 'neonBlink 1s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
