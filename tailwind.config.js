/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#3C5B6F",
        // primary: "#0F62FE", // buttons/accents
        secondary: "#EA8966", // warm buttons
        main: "#365766", // background
        surface: "#e9ecef", // form cards
        textDark: "#212529", // dark text on light
        textLight: "#FFFFFF", // light text on dark
        "secondary-colour": "#E88D67",
      },
      fontFamily: {
        display: ["New Amsterdam", "sans-serif"],
      },
    },
  },
  plugins: [],
};
