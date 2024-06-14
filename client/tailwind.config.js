/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        200: "200px",
        225: "225px",
        275: "275px",
        300: "300px",
        350: "350px",
        375: "375px",
        400: "400px",
        500: "500px",
        600: "600px",
        800: "800px",
      },
      height: {
        225: "225px",
        275: "275px",
        300: "300px",
        350: "350px",
        375: "375px",
        400: "400px",
        500: "500px",
        600: "600px",
        700: "700px",
        800: "800px",
      },
      minWidth: {
        250: "250px",
        350: "350px",
      },
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        caveat: ["Caveat", "cursive"],
        chillax: ["Chillax", "sans-serif"],
      },

      animation: {
        blob: "bolb 7s infinite",
        fadeIn: "fadeIn 1s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(50%)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0%)",
          },
        },
        bolb: {
          "0%": {
            transform: "scale(1) translate(0px,0px)",
          },
          "33%": {
            transform: "scale(1.1) translate(10px,-10px)",
          },
          "66%": {
            transform: "scale(0.9) translate(10px,10px)",
          },
          "100%": {
            transform: "scale(1) translate(0px,0px)",
          },
        },
      },
    },
    screens: {
      xs: "450px",
      sm: "640px",
      md: "738px",
      lg: "1024px",
      xl: "1366px",
    },
  },
  plugins: [
    typography,
    // ...
  ],
};
