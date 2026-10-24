/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors:{
        'primary': '#123B8B',  // Company primary blue
        'accent': '#F2AF18',   // Company accent orange
      }
    },
  },
  plugins: [],
}

