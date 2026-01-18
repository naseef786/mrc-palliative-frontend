import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";

export interface Patient {
  id: string;
  name: string;
  dob: string;
  address: string;
  emergencyContact: string;
  medicalHistory?: string;
}

interface PatientState {
  patients: Patient[];
  addPatient: (data: Omit<Patient, "id">) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      patients: [],
      addPatient: (data) =>
        set((state) => ({
          patients: [...state.patients, { id: nanoid(), ...data }],
        })),
      updatePatient: (id, data) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deletePatient: (id) =>
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
