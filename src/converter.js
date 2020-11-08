const theo = require("theo");

const { writeFileSync, existsSync, mkdirSync } = require("fs");
const path = require("path");
const prettier = require("prettier");

const chalk = require("chalk");

const exceptionHandler = require("./exception-handler");

const configHandler = require("./config-handler");

const registerTransformer = () => {
  const isOneOf = (item) =>
    item === "unit" || item === "number" || item === "size";

  const toNumber = (prop) => {
    const item = `${prop.get("value")}`;

    let splitStr = item.split("px");

    if (splitStr.length > 1) {
      if (splitStr[splitStr.length - 1] === "") splitStr.pop();

      return splitStr.length < 2
        ? +splitStr.join("")
        : splitStr.map((item) => +item);
    }

    const parsed = prop.get("category") !== "font-weight" ? +item : item;

    return isNaN(parsed) ? item : parsed;
  };

  const toJsObject = (prop) => {
    let { entries } = prop.get("value")._root;

    entries = entries.map((item) => {
      let name = item[0];

      while (name.includes("-")) {
        const postHyphenStr = name[name.indexOf("-") + 1];

        name = name.replace(/-./, postHyphenStr.toUpperCase()).replace("-");
      }

      return [name, item[1]];
    });

    return Object.fromEntries(entries);
  };

  theo.registerValueTransform(
    "fixedSize/number",
    (prop) => isOneOf(prop.get("type")),
    toNumber
  );

  theo.registerValueTransform(
    "object/jsObject",
    (prop) => prop.get("type") === "object",
    toJsObject
  );

  theo.registerTransform("native", [
    "color/hex",
    "relative/pixel",
    "percentage/float",
    "fixedSize/number",
    "object/jsObject",
  ]);
};

const convert = (config) => {
  try {
    const outPath = path.resolve(config.styles.output.dir);

    if (!existsSync(outPath)) mkdirSync(outPath, { recursive: true });

    (
      config.styles.files ||
      exceptionHandler(
        new Error(
          "react-native-theo.config.js >> styles >> files is undefined"
        ),
        "try 'init -c -f' to update the config file"
      )
    ).forEach((file, index, array) => {
      const outFile = path.resolve(
        outPath,
        `./${file
          .split("/")
          .pop()
          .replace(".yml", config.styles.output.extension)}`
      );

      console.log(
        index == 0 ? "\n" : "",
        chalk.greenBright("info"),
        "Creating",
        chalk.gray(outFile),
        index + 1 == array.length ? "\n" : ""
      );

      const result = theo.convertSync({
        transform: {
          type: "native",
          file,
        },
        format: {
          type: config.styles.output.format,
        },
      });

      const output = prettier.format(result, {
        parser: config.styles.output.extension.includes("ts")
          ? "typescript"
          : "babel",
      });

      writeFileSync(outFile, output);
    });
  } catch (err) {
    exceptionHandler(err);
  }
};

// -------------------------------------------------------- Export --------------------------------------------------------

module.exports = () => {
  let config = configHandler.handle();

  registerTransformer();

  convert(config);
};
