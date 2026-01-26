import { Dimensions } from "react-native";

/**
 * Responsive chart width for all mobile screen sizes
 * Keeps charts readable on small & large devices
 */
export const getChartWidth = (padding = 32, maxWidth = 380) => {
  const screenWidth = Dimensions.get("window").width;
  return Math.min(screenWidth - padding, maxWidth);
};
