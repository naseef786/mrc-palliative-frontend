import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Patient {
  id: string;
  name: string;
  dob: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
}

interface PatientState {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  appendPatients: (patients: Patient[]) => void;
  upsertPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      patients: [],

      setPatients: (patients) => set({ patients }),

      appendPatients: (patients) =>
        set((state) => ({
          patients: [...state.patients, ...patients],
        })),

      upsertPatient: (patient) =>
        set((state) => {
          const exists = state.patients.some(
            (p) => p.id === patient.id
          );

          return {
            patients: exists
              ? state.patients.map((p) =>
                  p.id === patient.id ? patient : p
                )
              : [patient, ...state.patients],
          };
        }),

      removePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "patient-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
