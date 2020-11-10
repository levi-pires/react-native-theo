const chalk = require("chalk");

module.exports = (error, help) => {
  console.log(
    chalk.red("\nerror"),
    error.message.split("\n").join("\n       "),
    help ? chalk.yellowBright("\nhelp ") + help : "",
    "\nAborting"
  );

  process.exit(1);
};
