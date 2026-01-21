import api from "./axios";

export interface Volunteer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    role: string;
}

export const getVolunteersApi = async ({
    page,
    limit,
    search,
}: {
    page: number;
    limit: number;
    search?: string;
}) => {
    const res = await api.get("/volunteers", {
        params: { page, limit, search },
    });

    return res.data;
};

export const updateVolunteerApi = async (id: string, data: Partial<Volunteer>) => {
    const res = await api.put(`/volunteers/${id}`, data);
    return res.data;
};

export const deleteVolunteerApi = async (id: string) => {
    const res = await api.delete(`/volunteers/${id}`);
    return res.data;
};

export const addVolunteerApi = async (data: Partial<Volunteer>) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
};
