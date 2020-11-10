module.exports = {
  styles: {
    files: ["./tokens/tokens.yml"],
    output: { dir: "./src/tokens/", extension: ".js", format: "module.js" },
  },

  fonts: {
    files: ["./tokens/fonts/index.yml"],
    urls: ["https://fonts.googleapis.com/css2?family=Roboto&display=swap"],
  },
};
