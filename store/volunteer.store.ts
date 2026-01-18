import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAsyncStorage } from "@/utils/asyncStorageWrapper";

export interface Volunteer {
  id: string;
  name: string;
  email: string;
}

interface VolunteerState {
  volunteers: Volunteer[];
  addVolunteer: (v: Volunteer) => void;
  updateVolunteer: (id: string, v: Partial<Volunteer>) => void;
  deleteVolunteer: (id: string) => void;
}

export const useVolunteerStore = create<VolunteerState>()(
  persist(
    (set, get) => ({
      volunteers: [],
      addVolunteer: (v) => set({ volunteers: [...get().volunteers, v] }),
      updateVolunteer: (id, v) =>
        set({
          volunteers: get().volunteers.map((vol) =>
            vol.id === id ? { ...vol, ...v } : vol
          ),
        }),
      deleteVolunteer: (id) =>
        set({ volunteers: get().volunteers.filter((v) => v.id !== id) }),
    }),
    {
      name: "volunteer-storage",
      storage: createAsyncStorage<VolunteerState>(),
    }
  )
);
