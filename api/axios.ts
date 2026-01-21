import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.16:5000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // ✅ READ FROM ZUSTAND DIRECTLY
    const token = useAuthStore.getState().token;
    console.log(token, ":Auth Token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized – token invalid or expired");

      // Optional auto logout
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
