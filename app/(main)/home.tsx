import { useTheme } from "@react-navigation/native";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function () {
  const theme = useTheme();

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: () => theme.colors.text,
    strokeWidth: 3,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        PatientList Overview
      </Text>

      {/* Summary Cards */}
      <View style={styles.cardRow}>
        <StatCard
          title="Total Schedules"
          value="124"
          theme={theme}
        />
        <StatCard
          title="Completed Tasks"
          value="98"
          theme={theme}
        />
      </View>

      <View style={styles.cardRow}>
        <StatCard
          title="Active Volunteers"
          value="32"
          theme={theme}
        />
        <StatCard
          title="Critical Tasks"
          value="7"
          theme={theme}
        />
      </View>

      {/* Line Chart */}
      <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Monthly Schedules
        </Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ data: [12, 18, 10, 22, 30, 25] }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Bar Chart */}
      <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Tasks Completed by Volunteers
        </Text>
        <BarChart
          data={{
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{ data: [8, 12, 6, 15, 10] }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix=""
          style={{ borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
}

/* ---------- Small Reusable Card ---------- */

function StatCard({ title, value, theme }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
      <Text style={{ color: theme.colors.text, opacity: 0.7 }}>
        {title}
      </Text>
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 24,
          fontWeight: "700",
          marginTop: 6,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});
