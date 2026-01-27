
import { Schedule } from "@/store/shedule.store";
import api from "./axios";

export interface GetAssignedSchedulesResponse {
    data: Schedule[];
    nextPage?: number;
    pages?: any;
}

export const getAssignedSchedulesApi = async (
    page: number,
    limit: number,
    searchQuery?: string
): Promise<GetAssignedSchedulesResponse> => {
    const { data } = await api.get<GetAssignedSchedulesResponse>("/schedules/assigned", {
        params: { page, limit, search: searchQuery },
    });
    return data;
};

export const updateScheduleStatusApi = async ({
    id,
    status,
}: {
    id: string;
    status: "pending" | "in-progress" | "completed" | "expired";
}) => {
    const { data } = await api.patch(`/schedules/${id}/status`, { status });
    return data;
};
