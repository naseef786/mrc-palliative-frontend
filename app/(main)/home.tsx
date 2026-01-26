import { useAnalytics } from "@/hooks/useAnalytics";
import { useAnalyticsStore } from "@/store/analytics.store";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { selectedMonth, selectedYear, setMonthYear, analytics } = useAnalyticsStore();
  const { data, refetch, isFetching } = useAnalytics();

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: () => theme.colors.primary,
    labelColor: () => theme.colors.text,
    strokeWidth: 3,
    propsForDots: { r: "4", strokeWidth: "2", stroke: theme.colors.primary },
  };

  const chartWidth = 360;

  const statusLabels = useMemo(() => Object.keys(analytics?.schedulesByStatus || {}), [analytics]);
  const statusCounts = useMemo(() => Object.values(analytics?.schedulesByStatus || {}), [analytics]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Analytics Overview</Text>
      {/* Stats */}
      <View style={styles.cardRow}>
        <StatCard title="Patients" value={analytics?.cards.totalPatients ?? 0} theme={theme} />
        <StatCard title="Volunteers" value={analytics?.cards.totalVolunteers ?? 0} theme={theme} />
      </View>

      <View style={styles.cardRow}>
        <StatCard title="Schedules" value={analytics?.cards.totalSchedules ?? 0} theme={theme} />
        <StatCard title="Completed" value={analytics?.cards.completedSchedules ?? 0} theme={theme} />
      </View>
      {/* Month/Year Picker */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(month) => setMonthYear(month, selectedYear)}
          style={{ flex: 1, color: theme.colors.text }}
        >
          {months.map((m, idx) => (
            <Picker.Item key={idx} label={m} value={idx + 1} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedYear}
          onValueChange={(year) => setMonthYear(selectedMonth, year)}
          style={{ flex: 1, color: theme.colors.text }}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
            <Picker.Item key={y} label={y.toString()} value={y} />
          ))}
        </Picker>
      </View>

      {/* Summary Cards */}
      <View style={styles.cardRow}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Text style={{ color: theme.colors.text }}>Total Patients</Text>
          <Text style={{ color: theme.colors.primary, fontSize: 22, fontWeight: "700" }}>
            {analytics?.cards.totalPatients ?? "-"}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Text style={{ color: theme.colors.text }}>Completed Tasks</Text>
          <Text style={{ color: theme.colors.primary, fontSize: 22, fontWeight: "700" }}>
            {analytics?.cards.completedSchedules ?? "-"}
          </Text>
        </View>
      </View>

      {/* Status Bar Chart */}
      <BarChart
        data={{ labels: statusLabels, datasets: [{ data: statusCounts }] }}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        style={{ borderRadius: 16, marginTop: 16 }}
      />

      {/* Monthly Trend Line Chart */}
      <LineChart
        data={{
          labels: months,
          datasets: [
            {
              data: months.map(
                (_, i) =>
                  analytics?.schedulesByMonth.find((m) => m.month === i + 1)?.count ?? 0
              ),
            },
          ],
        }}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 16, marginTop: 16 }}
      />
    </ScrollView>
  );
}


/* ---------- Stat Card ---------- */
function StatCard({ title, value, theme }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
      <Text style={{ color: theme.colors.text, opacity: 0.7 }}>{title}</Text>
      <Text style={{ color: theme.colors.primary, fontSize: 24, fontWeight: "700", marginTop: 6 }}>{value}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  pickerCard: { padding: 12, borderRadius: 16, marginBottom: 16 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  statCard: { width: "48%", padding: 16, borderRadius: 16 },
  chartCard: { padding: 16, borderRadius: 16, marginTop: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
});