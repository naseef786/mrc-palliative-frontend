import {
    createPatientApi,
    deletePatientApi,
    getPatientsApi,
    updatePatientApi,
} from "@/api/patient.api";
import { queryClient } from "@/lib/queryClient";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePatients = () =>
    useInfiniteQuery({
        queryKey: ["patients"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getPatientsApi(pageParam, 10),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });

export const useCreatePatient = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createPatientApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
    });
};

export const useUpdatePatient = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updatePatientApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
    });
};

export const useDeletePatient = () =>
    useMutation({
        mutationFn: deletePatientApi,

        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["patients"] });

            const previousData = queryClient.getQueryData(["patients"]);

            queryClient.setQueryData<any>(["patients"], (old: any) => {
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
                queryClient.setQueryData(["patients"], context.previousData);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
        },
    });
