/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#3C5B6F",
        secondary: "#EA8966",
        main: "#365766",
        surface: "#e9ecef",
        textDark: "#212529",
        textLight: "#FFFFFF",
        "secondary-colour": "#E88D67",
      },
      fontFamily: {
        display: ["New Amsterdam", "sans-serif"],
      },
      keyframes: {
        trolley: {
          // "0%": { transform: "translateX(0)" },
          // "25%": { transform: "translateX(calc(100vw - 15rem))" },
          "50%": {
            transform: "translateX(calc(100vw - 15rem))",
          },
          // "75%": { transform: "translateX(0)" },
          // "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        trolleySlow: "trolley 7s ease-in-out infinite",
        trolleyFast: "trolley 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
