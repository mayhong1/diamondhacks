/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "barn-red": "#780000",
        "fire-brick": "#c1121f",
        "papaya-whip": "#fdf0d5",
        "prussian-blue": "#003049",
        "air-superiority-blue": "#669bbc",
      },
    },
  },
  plugins: [],
};
