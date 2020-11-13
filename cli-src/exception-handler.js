const chalk = require("chalk");
const { tab } = require("./etc");

module.exports = (error, help) => {
  console.log(
    chalk.red("\nerror"),
    error.message.split("\n").join("\n" + tab(1)),
    error.stack,
    help ? `${chalk.yellowBright("\nhelp")} ${help}` : "",
    "\n\nAborting"
  );

  process.exit(1);
};
