import { createAsyncStorage } from "@/utils/asyncStorageWrapper";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ScheduleStatus = "pending" | "in-progress" | "completed" | "expired";

export interface Schedule {
  id: string | null;
  patientName: string;
  task: string;
  date: string;
  status: ScheduleStatus;
  volunteerId?: string | null;
}

interface ScheduleState {
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, payload: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [],
      addSchedule: (schedule) =>
        set({ schedules: [...get().schedules, schedule] }),
      updateSchedule: (id, payload) =>
        set({
          schedules: get().schedules.map((s) =>
            s.id === id ? { ...s, ...payload } : s
          ),
        }),
      deleteSchedule: (id) =>
        set({ schedules: get().schedules.filter((s) => s.id !== id) }),
    }),
    {
      name: "schedule-storage",
      storage: createAsyncStorage<ScheduleState>(),
    }
  )
);
