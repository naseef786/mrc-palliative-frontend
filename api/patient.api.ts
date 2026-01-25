// axios instance with interceptor


import api from "./axios";

export interface PatientPayload {
  name: string;
  dob: string;
  address: string;
  emergencyContact: string;
  medicalHistory?: string;
}

export const getPatientsApi = async (page = 1, limit = 10) => {
  const res = await api.get("/patients", {
    params: { page, limit },
  });
  return res.data;
};

export const createPatientApi = async (data: PatientPayload) => {
  const res = await api.post("/patients", data);
  return res.data;
};

export const updatePatientApi = async (
  id: string,
  data: Partial<PatientPayload>
) => {
  const res = await api.put(`/patients/${id}`, data);
  return res.data;
};

export const deletePatientApi = async (id: string) => {
  const res = await api.delete(`/patients/${id}`);
  return res.data;
};
// patient.api.ts
export const searchPatientsApi = async (
  q: string,
  page = 1,
  limit = 10
) => {
  const res = await api.get("/patients/search", {
    params: { q, page, limit },
  });
  return res.data;
};

