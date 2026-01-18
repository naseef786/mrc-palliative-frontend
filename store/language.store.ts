import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAsyncStorage } from "@/utils/asyncStorageWrapper";
import { i18n } from "@/i18n";

export type AppLanguage = "en" | "ml";

interface LanguageState {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => {
        i18n.locale = lang; // update i18n instantly
        set({ language: lang });
      },
    }),
    {
      name: "language-storage",
      storage: createAsyncStorage<LanguageState>(),
    }
  )
);
