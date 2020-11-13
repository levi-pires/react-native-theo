const { spawn } = require("child_process");

const chalk = require("chalk");

const axios = require("axios").default;

const theo = require("theo");

const path = require("path");
const { writeFileSync, existsSync, mkdirSync } = require("fs");

const css = require("css");

const exceptionHandler = require("./exception-handler");
const configHandler = require("./config-handler");

const { tab } = require("./etc");
const { render } = require("./font-name-gen");

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

      const _return = {
        family: [],
        weight: [],
      };

      Object.values(eval(fonts)).forEach((item) => {
        if (typeof item == "string") {
          if (!_return.family.some((_item) => _item == item))
            _return.family.push(item.split(" ").join("+"));
        } else {
          _return.weight.push(item);
        }
      });

      return _return.family.map((fItem) => {
        return _return.weight.map(
          (wItem) =>
            `https://fonts.googleapis.com/css2?family=${fItem}:wght@${wItem}`
        );
      });
    });
  } catch (err) {
    exceptionHandler(err, "try 'init -c -f' to update the config file");
  }
};

const convertLink = (urls) => {
  return urls.map(async (url) => {
    try {
      const { data } = await axios.get(url);

      const cssObj = css.parse(data);

      return cssObj.stylesheet.rules.map((rule) => {
        const font = [];

        rule.declarations
          .filter((item) => item.property == "src")
          .forEach((declaration) => {
            const urlRegExp = /url\(([^)]+)/;

            const src = urlRegExp.exec(declaration.value)[1];
            const srcWithoutQuote = src.split("'").join("");
            font.push(srcWithoutQuote);
          });

        rule.declarations
          .filter((item) => item.property == "font-family")
          .forEach((declaration) => {
            const fontFamily = declaration.value.split(" ").join("-");
            const fontFamilyWithoutQuote = fontFamily.split("'").join("");

            const fontWeight = rule.declarations.filter(
              (item) => item.property == "font-weight"
            )[0].value;

            const italic = rule.declarations.filter(
              (item) => item.property == "font-style"
            )[0].value;

            font.push(
              render({
                fontFamily: fontFamilyWithoutQuote,
                fontWeight,
                italic: italic == "italic",
              })
            );
          });

        return {
          src: font[0],
          local: font[1],
          format: /[^.]+$/.exec(font[0]),
        };
      });
    } catch (err) {
      exceptionHandler(err);
    }
  });
};

const link = () => {
  console.log(
    chalk.green("\ninfo"),
    "Running",
    chalk.blueBright("yarn react-native link")
  );

  const yarn = spawn("yarn", ["react-native", "link"], {
    shell: process.env.OS && process.env.OS.includes("Windows"),
  });

  yarn.stdout.on("data", (chunk) => {
    console.log(tab(3), chunk.toString("utf-8").replace("\n", ""));
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
        chalk.green("\ninfo"),
        "Downloading from",
        chalk.gray(item.src),
        "to",
        chalk.gray(out)
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

// -------------------------------------------------------- Export --------------------------------------------------------

module.exports = async () => {
  const config = configHandler.handle();

  let fonts = [];

  if (config.fonts) {
    if (config.fonts.files) {
      const parsedFonts = convertYaml(config.fonts.files).flat(2);

      const convertedLinks = await Promise.all(convertLink(parsedFonts));

      fonts = fonts.concat(convertedLinks);
    }

    if (config.fonts.urls) {
      const convertedLinks = await Promise.all(convertLink(config.fonts.urls));

      fonts = fonts.concat(convertedLinks);
    }

    downloadFonts(fonts);
  } else {
    exceptionHandler(
      new Error("fonts is an empty object"),
      "check react-native-theo.config.js"
    );
  }
};
