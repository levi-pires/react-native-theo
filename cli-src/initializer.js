const path = require("path");
const prettier = require("prettier");
const configHandler = require("./config-handler");
const pathToSrc = path.resolve(
  __dirname,
  "../defaults/react-native-theo.config.js"
);

const chalk = require("chalk");
const figlet = require("figlet");

const { existsSync, copyFileSync, writeFileSync } = require("fs");
const exceptionHandler = require("./exception-handler");

const inquirer = require("inquirer");

const parseFiles = (list) => {
  if (list.length < 1) return "";

  const parsedList = list.split(",").map((item) => {
    if (existsSync(item)) {
      return `'${item}'`;
    } else {
      console.log(
        chalk.yellow("warn"),
        `${item} was not found. The item will be ignored and commented`
      );
      return `/*"${item}"*/`;
    }
  });

  return `files: [${parsedList}],`;
};

const parseUrls = (urls) => {
  if (urls.length < 1) return "";

  const parsedUrls = urls.split(",").map((item) => `'${item}'`);

  return `urls: [${parsedUrls}],`;
};

const genConfigStr = (options) => `module.exports = {
  styles: {
    ${parseFiles(options.styleFiles)}
    output: { dir: "${options.outDir}", extension: "${
  options.extension
}", format: "${options.format}" },
  },

  fonts: {
    ${parseFiles(options.fontFiles)}
    ${parseUrls(options.fontUrls)}
  },
  };`;

const create = async () => {
  try {
    const prompt = await inquirer.prompt([
      {
        type: "input",
        name: "styleFiles",
        message: "Paths to Style Tokens (separated by comma)",
      },
      {
        type: "input",
        name: "outDir",
        message: "Output directory",
      },
      {
        type: "list",
        name: "extension",
        message: "Output extension",
        choices: [
          { name: "JavaScript", value: ".js" },
          { name: "TypeScript", value: ".ts" },
        ],
      },
      {
        type: "list",
        name: "format",
        message: "Output format",
        choices: [
          { name: "Common", value: "common.js" },
          { name: "Module", value: "module.js" },
        ],
      },
      {
        type: "input",
        name: "fontFiles",
        message: "Paths to Font Tokens (separated by comma)",
      },
      {
        type: "input",
        name: "fontUrls",
        message: "Font Urls (separated by comma)",
      },
    ]);

    writeFileSync(
      configHandler.path,
      prettier.format(genConfigStr(prompt), { parser: "babel" })
    );
  } catch (err) {
    exceptionHandler(err);
  }
};

// -------------------------------------------------------- Export --------------------------------------------------------

module.exports = (args) => {
  if (!existsSync(configHandler.path) || args.force) {
    console.log(
      chalk.blueBright(
        figlet.textSync("\nReact\n  Native\n    Theo", "JS Block Letters")
      ),
      "\n\n\n                            Welcome\n\n\n"
    );

    if (args.create) {
      create();
    } else {
      copyFileSync(pathToSrc, configHandler.path);
    }
  } else {
    console.log(
      chalk.greenBright("\ninfo"),
      "React Native Theo config file already exists.\n"
    );
  }
};
