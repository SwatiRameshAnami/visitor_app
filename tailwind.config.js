/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
  brand: {
    DEFAULT: "#DFF5E1",   // main background (light green)
    mint: "#CFF2E8",
    blue: "#E6F7FF",
  },
  surface: "#FFFFFF",    // cards / containers
  text: {
    primary: "#1F2937",  // dark text
    muted: "#6B7280",
  },
  gold: {
    400: "#f0c060",
    500: "#e0a830",
    300: "#f8d990",
  },
},
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};