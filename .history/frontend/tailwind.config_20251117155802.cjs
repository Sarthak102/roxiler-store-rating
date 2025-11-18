module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#021526", // darkest
          700: "#4A70A9",
          500: "#8FABD4",
          100: "#EFECE3"  // accent / light
        }
      }
    }
  },
  plugins: [],
};