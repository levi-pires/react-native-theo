declare type FontWeights =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
declare type FontSet = {
  fontFamily: string;
  fontWeight: FontWeights;
  italic?: true;
};
/**
 *
 * not tested on IOS
 */
export declare function renderNativeFont(fontSet: FontSet): string;
