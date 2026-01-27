import { createAsyncStorage } from "@/utils/asyncStorageWrapper";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ScheduleStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "expired";

export interface Schedule {
  _id: string;
  patient: {
    _id: string;
    name: string;
  };
  date: string;
  info?: string;
  remarks?: string;
  message?: string;
  otherInfo?: string;
  status: ScheduleStatus;
  assignedVolunteer?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ScheduleState {
  /* DATA CACHE */
  schedules: Schedule[];

  /* UI */
  editing: Schedule | null;

  /* CRUD */
  setSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, payload: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;

  /* ASSIGNMENT */
  assignSelf: (scheduleId: string, volunteerId: string) => void;
  unassignSelf: (scheduleId: string) => void;

  /* EDITING */
  startEdit: (schedule: Schedule) => void;
  clearEdit: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      /* ================= DATA ================= */
      schedules: [],
      editing: null,

      /* ================= CACHE SYNC ================= */
      setSchedules: (schedules) => set({ schedules }),

      addSchedule: (schedule) =>
        set({ schedules: [schedule, ...get().schedules] }),

      updateSchedule: (id, payload) =>
        set({
          schedules: get().schedules.map((s) =>
            s._id === id ? { ...s, ...payload } : s
          ),
        }),

      deleteSchedule: (id) =>
        set({
          schedules: get().schedules.filter((s) => s._id !== id),
        }),

      /* ================= ASSIGN ================= */
      assignSelf: (scheduleId, volunteerId) =>
        set({
          schedules: get().schedules.map((s) =>
            s._id === scheduleId
              ? {
                ...s,
                volunteer: volunteerId,
                status: "in-progress",
              }
              : s
          ),
        }),

      unassignSelf: (scheduleId) =>
        set({
          schedules: get().schedules.map((s) =>
            s._id === scheduleId
              ? {
                ...s,
                volunteer: null,
                status: "pending",
              }
              : s
          ),
        }),

      /* ================= EDIT ================= */
      startEdit: (schedule) => set({ editing: schedule }),
      clearEdit: () => set({ editing: null }),
    }),
    {
      name: "schedule-storage",
      storage: createAsyncStorage<ScheduleState>(),
    }
  )
);
