import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAsyncStorage } from "@/utils/asyncStorageWrapper";

export type UserRole = "admin" | "volunteer";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  user: any | null;
  login: (token: string, role: UserRole, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      login: (token, role, user) => set({ token, role, user }),
      logout: () => set({ token: null, role: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createAsyncStorage<AuthState>(),
    }
  )
);
