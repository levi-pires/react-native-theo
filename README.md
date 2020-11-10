# <img src="https://raw.githubusercontent.com/levi-pires/react-native-theo/master/assets/react-icon.webp" alt="RN logo" width="28" /> React Native + Theo <img src="https://raw.githubusercontent.com/salesforce-ux/theo/master/assets/theo.png" alt="Theo logo" width="28" />

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

Theo is an abstraction for transforming and formatting [Design Tokens](#overview).

## Example

```yaml
# buttons.yml
props:
  button_background:
    value: "{!primary_color}"
imports:
  - ./aliases.yml
global:
  type: color
  category: buttons
```

[npm-url]: https://npmjs.org/package/theo
[npm-image]: http://img.shields.io/npm/v/theo.svg
[travis-url]: https://travis-ci.org/salesforce-ux/theo
[travis-image]: http://img.shields.io/travis/salesforce-ux/theo.svg
