// import { View } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useAnalyticsStore } from "@/store/analytics.store";

// export function MonthPicker() {
//   const { selectedMonth, setSelectedMonth } = useAnalyticsStore();

//   return (
//     <View>
//       <Picker
//         selectedValue={selectedMonth}
//         onValueChange={(value) => setSelectedMonth(value)}
//       >
//         {Array.from({ length: 12 }).map((_, i) => (
//           <Picker.Item
//             key={i}
//             label={new Date(0, i).toLocaleString("default", {
//               month: "long",
//             })}
//             value={i + 1}
//           />
//         ))}
//       </Picker>
//     </View>
//   );
// }
