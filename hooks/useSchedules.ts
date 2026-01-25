import {
    assignSelfApi,
    createScheduleApi,
    deleteScheduleApi,
    getSchedulesApi,
    searchSchedulesApi,
    unassignSelfApi,
    updateScheduleApi,
} from "@/api/schedule.api";
import { queryClient } from "@/lib/queryClient";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSchedules = () =>
    useInfiniteQuery({
        queryKey: ["schedules"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getSchedulesApi(pageParam),
        getNextPageParam: (lastPage) =>
            lastPage.data.meta.page < lastPage.data.meta.pages
                ? lastPage.data.meta.page + 1
                : undefined,
    });

export const useSchedulesQueryInfinite = (search: string) => {

    return useInfiniteQuery({
        queryKey: ["schedules", search],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }) =>
            search ? searchSchedulesApi(search, pageParam, 10) : getSchedulesApi(pageParam, 10),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });
}


export const useCreateSchedule = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createScheduleApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["schedules"] }),
    });
};

export const useUpdateSchedule = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateScheduleApi({ id, data }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["schedules"] }),
    });
};

/* DELETE */
export const useDeleteScheduleMutation = (options?: {
    onSuccess?: (data: any, id: string) => void;
}) => {
    return useMutation({
        mutationFn: deleteScheduleApi,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["schedules"] });

            const previousData = queryClient.getQueryData(["schedules"]);

            queryClient.setQueryData<any>(["schedules"], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((p: any) => p._id !== id),
                    })),
                };
            });

            return { previousData };
        },
        onError: (_, __, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["schedules"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};


/* ===================== ASSIGN ===================== */

export const useAssignSchedule = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) =>
            assignSelfApi(payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};

/* ===================== UNASSIGN ===================== */

export const useUnassignSchedule = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) =>
            unassignSelfApi(payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};
