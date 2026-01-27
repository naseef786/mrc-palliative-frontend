import { Dimensions } from "react-native";

export const CHART_WIDTH = () =>
  Math.min(Dimensions.get("window").width - 32, 360);
