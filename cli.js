#!/usr/bin/env node

const commander = require("commander");
const packageJson = require("./package.json");

const converter = require("./cli-src/converter");
const initializer = require("./cli-src/initializer");
const linker = require("./cli-src/linker");
const descriptions = require("./cli-src/descriptions");

commander.version(packageJson.version);

commander
  .command("convert-tokens")
  .description(descriptions.convert)
  .action(converter)
  .alias("convert");

commander
  .command("link-fonts")
  .description(descriptions.link)
  .action(linker)
  .alias("link");

commander
  .command("init")
  .option("-c, --create", descriptions.create)
  .option("-f, --force", descriptions.force)
  .description(descriptions.init)
  .action(initializer);

console.log("react-native-theo v" + packageJson.version);

commander.parse(process.argv);
