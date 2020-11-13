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
export function renderNativeFont(fontSet) {
  return {
    fontFamily: `${fontSet.fontFamily.split(" ").join("-")}-${
      fontWeights[fontSet.fontWeight]
    }${fontSet.italic ? "-Italic" : ""}`,
    ...fontSet.fontWeight,
  };
}
