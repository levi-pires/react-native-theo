const exceptionHandler = require("./exception-handler");
const path = require("path");

module.exports = {
  path: path.resolve(process.cwd(), "./react-native-theo.config.js"),
  handle: () => {
    try {
      return require(module.exports.path);
    } catch (err) {
      exceptionHandler(err, "Try using 'init' first");
    }
  },
};
