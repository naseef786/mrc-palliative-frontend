import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAsyncStorage } from "@/utils/asyncStorageWrapper";

export interface AnalyticsResponse {
  cards: {
    totalPatients: number;
    totalVolunteers: number;
    totalSchedules: number;
    completedSchedules: number;
  };
  schedulesByStatus: Record<string, number>;
  schedulesByMonth: { year: number; month: number; count: number }[];
}

interface AnalyticsState {
  selectedMonth: number;
  selectedYear: number;
  analytics: AnalyticsResponse | null;
  setMonthYear: (month: number, year: number) => void;
  setAnalytics: (data: AnalyticsResponse) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      analytics: null,
      setMonthYear: (month, year) => set({ selectedMonth: month, selectedYear: year }),
      setAnalytics: (data) => set({ analytics: data }),
    }),
    {
      name: "analytics-storage",
      storage: createAsyncStorage<AnalyticsState>(),
    }
  )
);
