import { AnalyticsResponse } from "@/store/analytics.store";
import api from "./axios";


export const getAnalyticsApi = async (
    month: number,
    year: number
): Promise<AnalyticsResponse> => {
    const { data } = await api.get<AnalyticsResponse>("/analytics", {
        params: { month, year },
    });
    return data;
};
