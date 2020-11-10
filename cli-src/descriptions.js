const chalk = require("chalk");

module.exports = {
  convert: "Convert style tokens",

  link:
    "Download and link fonts using " +
    chalk.blueBright("yarn react-native link"),

  init: "Generate " + chalk.greenBright("react-native-theo.config.js"),

  create: "Generate custom " + chalk.greenBright("react-native-theo.config.js"),

  force:
    "Can be used to update the configuration, should be used along with " +
    chalk.blueBright("--create"),
};
