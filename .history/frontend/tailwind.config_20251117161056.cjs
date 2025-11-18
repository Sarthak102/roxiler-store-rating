// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1DBF73",
        },
        accent: {
          500: "#8FAEDC",
        },
      },
    },
  },
  plugins: [],
};
