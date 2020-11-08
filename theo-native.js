#!/usr/bin/env node

const commander = require("commander");
const package = require("./package.json");

const converter = require("./src/converter");
const initializer = require("./src/initializer");
const linker = require("./src/linker");
const descriptions = require("./src/descriptions");

commander.version(package.version);

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

commander.parse(process.argv);
