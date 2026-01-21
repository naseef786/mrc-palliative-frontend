// axios instance with interceptor

import API from "./axios";

export interface PatientPayload {
  name: string;
  dob: string;
  address: string;
  emergencyContact: string;
  medicalHistory?: string;
}

export const getPatientsApi = async (page = 1, limit = 10) => {
  const res = await API.get("/patients", {
    params: { page, limit },
  });
  return res.data;
};

export const createPatientApi = async (data: PatientPayload) => {
  const res = await API.post("/patients", data);
  return res.data;
};

export const updatePatientApi = async (
  id: string,
  data: Partial<PatientPayload>
) => {
  const res = await API.put(`/patients/${id}`, data);
  return res.data;
};

export const deletePatientApi = async (id: string) => {
  const res = await API.delete(`/patients/${id}`);
  return res.data;
};
