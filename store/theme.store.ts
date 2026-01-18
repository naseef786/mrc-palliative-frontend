import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAsyncStorage } from "@/utils/asyncStorageWrapper";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-storage",
      storage: createAsyncStorage<ThemeState>(),
    }
  )
);
