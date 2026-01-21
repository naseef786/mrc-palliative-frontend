import API from "@/api/axios";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
    role: "admin" | "volunteer";
}

export const loginApi = async (payload: LoginPayload) => {
    const { data } = await API.post("/auth/login", payload);
    return data;
};

export const signupApi = async (payload: SignupPayload) => {
    const { data } = await API.post("/auth/signup", payload);
    return data;
};
