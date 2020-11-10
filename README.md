# <img src="https://raw.githubusercontent.com/levi-pires/react-native-theo/master/assets/react-icon.webp" alt="RN logo" width="35" height="27" /> React Native + Theo <img src="https://raw.githubusercontent.com/salesforce-ux/theo/master/assets/theo.png" alt="Theo logo" width="28" height="28" />

[![NPM version][npm-image]][npm-url]

React Native Theo is an implementation of [Theo](https://github.com/salesforce-ux/theo) for React Native. Due to the use of tools that RN doesn't provide during runtime (like **fs** and **path**) I decided to create a CLI to handle Design Tokens before packaging.

## Installation

`yarn add react-native-theo`

## Basic Help

`yarn theo-native --help`

## CLI

First of all, start the project with `yarn theo-native init`. This command generates a default [config file](#default-configuration-file). If you want to create your own config file, try `yarn theo-native init --create`. You can also use the `--force` flag to change configurations.

### Link Fonts

Before linking, you will have to set up the [react-native.config.js](#react-native-configuration) to link fonts properly. If you already have it you can skip this step.

To link the fonts, run `yarn theo-native link-fonts`.

> Note: I highly recommend you to use Google Fonts links
> Note: The _.yml_ files that will be used on linking must follow [this](#font-token) format

### Convert Tokens

This part is pretty straightforward. Just run `yarn theo-native convert-tokens`

> Example:
>
> > input: ./tokens/tokens.yml
> > output: ./src/tokens.ts
> >
> > > ```typescript
> > > export const borderStyleDefault = "solid";
> > > export const borderWidthNone = 0;
> > > export const borderWidthHairline = 1;
> > > export const borderWidthThin = 2;
> > > export const borderWidthThick = 4;
> > > export const borderWidthHeavy = 8;
> > > export const opacityLevelSemiopaque = 0.8;
> > > export const opacityLevelIntense = 0.64;
> > > export const opacityLevelMedium = 0.32;
> > > export const opacityLevelLight = 0.16;
> > > export const opacityLevelSemitransparent = 0.08;
> > > export const borderRadiusNone = 0;
> > > /* ... */
> > > ```

## API Usage

Since React Native has a limited support to external fonts, I created this simple function.

> Note: Mainly on Android, the output of the function has to be the same as the file name

```javascript
const { renderNativeFont } = require('react-native-theo')

const styles = {
  foo: {
    fontFamily: renderNativeFont({
      fontFamily: 'Roboto';
      fontWeight: '600';
      italic: true;
    }) // output: Roboto-SemiBold-Italic
  }
}
```

## Font Token

```yaml
# archivo.yml
global:
  type: object
  category: typography

props:
  - name: archivo-regular
    value:
      src: "https://fonts.gstatic.com/s/archivo/v7/k3kQo8UDI-1M0wlSTd4.ttf"
      local: "Archivo-Regular"
      format: ttf
    type: object
    category: font

  - name: archivo-medium
    value:
      src: "https://fonts.gstatic.com/s/archivo/v7/k3kVo8UDI-1M0wlSdSrLC0E.ttf"
      local: "Archivo-Medium"
      format: ttf
    type: object
    category: font
```

## Default Configuration File

```javascript
// react-native-theo.config.js
module.exports = {
  // All required if you are going to use 'theo-native convert-tokens'
  styles: {
    files: ["./tokens/tokens.yml"],
    output: {
      dir: "./src/tokens/",
      // .js | .ts
      extension: ".js",
      // module.js | common.js
      format: "module.js",
    },
  },

  // You can declare both files and urls, but you cannot declare
  // 'fonts: {}' if you are going to use 'theo-native link-fonts'
  fonts: {
    files: ["./tokens/fonts/index.yml"],
    urls: ["https://fonts.googleapis.com/css2?family=Roboto&display=swap"],
  },
};
```

## React Native Configuration

```javascript
// react-native.config.js
module.exports = {
  assets: ["./assets/fonts/"] /* you will need to add this line */,
};
```

[npm-url]: https://npmjs.org/package/react-native-theo
[npm-image]: http://img.shields.io/npm/v/react-native-theo.svg
[travis-url]: https://travis-ci.org/salesforce-ux/theo
[travis-image]: http://img.shields.io/travis/salesforce-ux/theo.svg
