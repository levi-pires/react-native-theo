module.exports = {
  styles: {
    files: ["./tokens/tokens.yml"],
    output: { dir: "./src/tokens/", extension: ".js", format: "module.js" },
  },

  fonts: {
    files: ["./tokens/brand-01/typography/index.yml"],
    urls: [
      "https://fonts.googleapis.com/css2?family=Roboto",
      "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,900;1,700",
    ],
  },
};
