const { spawn } = require("child_process");
const { writeFileSync, existsSync, mkdirSync } = require("fs");
const exceptionHandler = require("./exception-handler");
const chalk = require("chalk");
const axios = require("axios").default;
const theo = require("theo");
const path = require("path");
const css = require("css");
const configHandler = require("./config-handler");

const convertYaml = (srcArray) => {
  try {
    return srcArray.map((src) => {
      const fonts = theo.convertSync({
        transform: {
          type: "raw",
          file: src,
        },
        format: {
          type: "common.js",
        },
      });

      return Object.values(eval(fonts));
    });
  } catch (err) {
    exceptionHandler(err, "try 'init -c -f' to update the config file");
  }
};

const convertLink = (urls) => {
  return urls.map(async (url) => {
    try {
      const { data } = await axios.get(url);

      const obj = css.parse(data);

      return obj.stylesheet.rules.map((rule) => {
        const fonts = [];

        rule.declarations
          .filter((item) => item.property == "src")
          .forEach((declaration) => {
            const regexp = /\(([^)]+)/;

            while (regexp.test(declaration.value)) {
              const srcItem = regexp.exec(declaration.value)[1];
              const srcItemWithoutQuote = srcItem.split("'").join("");

              fonts.push(srcItemWithoutQuote);

              declaration.value = declaration.value.replace(regexp, "");
            }
          });

        fonts.shift();

        return {
          local: fonts[0],
          src: fonts[1],
          format: fonts[2].includes("true") ? "ttf" : "otf",
        };
      });
    } catch (err) {
      exceptionHandler(err);
    }
  });
};

const link = () => {
  console.log(
    chalk.green("info"),
    "Running",
    chalk.blueBright("yarn react-native link")
  );

  const yarn = spawn("yarn", ["react-native", "link"]);

  yarn.stdout.on("data", (chunk) => {
    console.log("      ", chunk.toString("utf-8").replace("\n", ""));
  });

  yarn.stderr.on("data", (chunk) =>
    exceptionHandler(new Error(chunk.toString("utf-8")))
  );

  yarn.on("error", exceptionHandler);

  yarn.on("close", (code) =>
    console.log("\nYarn executed with exit code " + code)
  );
};

const downloadFonts = (fonts) => {
  const outPath = path.resolve(process.cwd(), "./assets/fonts/");

  if (!existsSync(outPath)) mkdirSync(outPath, { recursive: true });

  fonts.forEach(async (font, index, fontArray) => {
    const downloadHooks = font.map(async (item) => {
      const out = path.resolve(outPath, `./${item.local}.${item.format}`);

      console.log(
        chalk.green("info"),
        "Downloading from",
        chalk.gray(item.src),
        "to",
        chalk.gray(out + "\n")
      );

      try {
        const { data } = await axios.get(item.src);

        writeFileSync(out, data);
      } catch (err) {
        exceptionHandler(err);
      }
    });

    await Promise.all(downloadHooks);

    if (index + 1 == fontArray.length) {
      link();
    }
  });
};

module.exports = async () => {
  const config = configHandler.handle();

  let fonts = [];

  if (config.fonts.files) {
    fonts = fonts.concat(convertYaml(config.fonts.files));
  }

  if (config.fonts.urls) {
    console.log(chalk.green("\ninfo"), "Converting urls\n");

    const convertedLinks = await Promise.all(convertLink(config.fonts.urls));

    fonts = fonts.concat(convertedLinks);
  }

  downloadFonts(fonts);
};
