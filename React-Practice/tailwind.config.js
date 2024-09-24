/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#3C5B6F",
        // "regal-blue": "#7C9082",
        // "secondary-colour": "#E88D67",
        "secondary-colour": "#E88D67",
      },
      fontFamily: {
        display: ["New Amsterdam", "sans-serif"],
      },
    },
  },
  plugins: [],
};
