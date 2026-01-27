import api from "@/api/axios";

export interface Volunteer {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "admin" | "volunteer";
    bloodGroup?: string;
    dob?: string;
    address?: string;
    emergencyContact?: string;
    totalServices?: number;
    createdAt?:any;
    updatedAt?:any;
}

export interface VolunteerResponse {
    data: Volunteer[];
    pagination: {
        page: number;
        limit: number;
        hasMore: boolean;
    };
}

export const getVolunteersApi = async (params: {
    page: number;
    limit: number;
    search?: string;
}): Promise<VolunteerResponse> => {
    const res = await api.get("/volunteers", { params });
    return res.data;
};

export const createVolunteerApi = async (payload: any) => {
    const res = await api.post("/auth/signup", payload);
    return res.data;
};

export const updateVolunteerApi = async (id: string, payload: any) => {
    const res = await api.put(`/volunteers/${id}`, payload);
    return res.data;
};

export const deleteVolunteerApi = async (id: string) => {
    const res = await api.delete(`/volunteers/${id}`);
    return res.data;
};
