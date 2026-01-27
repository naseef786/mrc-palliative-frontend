import api from "./axios";


export const getSchedulesApi = async (page = 1, limit = 10) => {
  const res = await api.get(`/schedules?page=${page}&limit=${limit}`);
  return res.data;
};
export const searchSchedulesApi = async (
  q: string,
  page = 1,
  limit = 10
) => {
  console.log({ q, page, limit });

  const res = await api.get("/schedules", {
    params: { q, page, limit },
  });
  return res.data;
};
export const createScheduleApi = async (data: any) => {
  const res = await api.post("/schedules", data);
  return res.data;
};

export const updateScheduleApi = async ({ id, data }: any) => {
  const res = await api.put(`/schedules/${id}`, data);
  return res.data;
};

export const deleteScheduleApi = async (id: string) => {
  await api.delete(`/schedules/${id}`);
};

export const assignSelfApi = async (id: string) => {
  const res = await api.post(`/schedules/${id}/assign`);
  return res.data;
};

export const unassignSelfApi = async (id: string) => {
  const res = await api.post(`/schedules/${id}/unassign`);
  return res.data;
};
