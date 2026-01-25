import {
    createVolunteerApi,
    deleteVolunteerApi,
    getVolunteersApi,
    updateVolunteerApi,
} from "@/api/volunteer.api";
import { queryClient } from "@/lib/queryClient";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Infinite query for volunteers
export const useVolunteers = () =>
    useInfiniteQuery({
        queryKey: ["volunteers"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getVolunteersApi({ page: pageParam, limit: 10 }),
        getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined),
    });

// Create volunteer
export const useCreateVolunteer = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createVolunteerApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["volunteers"] }),
    });
};

// Update volunteer
export const useUpdateVolunteer = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateVolunteerApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["volunteers"] }),
    });
};

// Delete volunteer with optimistic update
export const useDeleteVolunteer = () =>
    useMutation({
        mutationFn: deleteVolunteerApi,

        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["volunteers"] });

            const previousData = queryClient.getQueryData(["volunteers"]);

            queryClient.setQueryData<any>(["volunteers"], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((v: any) => v._id !== id),
                    })),
                };
            });

            return { previousData };
        },

        onError: (_, __, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["volunteers"], context.previousData);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["volunteers"] });
        },
    });
