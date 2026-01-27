import api from "./axios";

export interface AnalyticsResponse {
    cards: {
        totalPatients: number;
        totalVolunteers: number;
        totalStaffs: number;
        totalSchedules: number;
        completedSchedules: number;
    };
    scheduleCounts: {
        pending: number;
        inProgress: number;
        completed: number;
        expired: number;
    };
    schedulesByMonth: {
        month: number; // 1 - 12
        count: number;
    }[];
}

export const getAnalyticsApi = async (
    month: number,
    year: number
): Promise<AnalyticsResponse> => {
    const res = await api.get("/analytics", {
        params: { month, year },
    });
    return res.data;
};
