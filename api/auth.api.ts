import axios from "axios";

const API_URL = "http://192.168.1.16:5000/api";

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
    const res = await axios.post(`${API_URL}/auth/login`, payload);
    console.log(res);

    return res.data;
};

export const signupApi = async (payload: SignupPayload) => {
    const res = await axios.post(`${API_URL}/auth/signup`, payload);
    return res.data;
};
