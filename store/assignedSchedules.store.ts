import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Schedule } from "./shedule.store";



interface AssignedScheduleState {
    schedules: Schedule[];
    setSchedules: (schedules: Schedule[]) => void;
    updateLocalStatus: (id: string, status: "pending" | "in-progress" | "completed" | "expired") => void;
}

export const useAssignedScheduleStore = create<AssignedScheduleState>()(
    persist(
        (set) => ({
            schedules: [],
            setSchedules: (schedules: Schedule[]) => set({ schedules }),
            updateLocalStatus: (id, status) =>
                set((state) => ({
                    schedules: state.schedules.map((s) => (s._id === id ? { ...s, status } : s)),
                })),
        }),
        { name: "assigned-schedules-storage" }
    )
);
