const fontWeights = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "UltraBold",
};
/**
 *
 * not tested on IOS
 */
module.exports = {
  /**
   * @param {{fontFamily: string; fontWeight: FontWeights; italic: boolean;}} fontSet
   */
  render: (fontSet) => {
    return `${fontSet.fontFamily.split(" ").join("-")}-${
      fontWeights[fontSet.fontWeight]
    }${fontSet.italic ? "-Italic" : ""}`;
  },
};
