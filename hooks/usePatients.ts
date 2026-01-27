import {
    createPatientApi,
    deletePatientApi,
    getPatientsApi,
    searchPatientsApi,
    updatePatientApi,
} from "@/api/patient.api";
import { queryClient } from "@/lib/queryClient";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

// =============== Fetch patients (paginated) ===============
export const usePatients = (searchQuery = "") =>
    useInfiniteQuery({
        queryKey: ["patients", searchQuery],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }) =>
            searchQuery ? searchPatientsApi(searchQuery, pageParam, 10) : getPatientsApi(pageParam, 10),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });

// =============== Create patient ===============
export const useCreatePatient = () => {

    return useMutation({
        mutationFn: createPatientApi,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
    });
};

// =============== Update patient ===============
export const useUpdatePatient = () => {

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updatePatientApi(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
    });
};

// =============== Delete patient with optimistic update ===============
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
