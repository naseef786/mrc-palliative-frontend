import { getAssignedSchedulesApi, GetAssignedSchedulesResponse, updateScheduleStatusApi } from "@/api/assignedSchedules.api";
import { useAssignedScheduleStore } from "@/store/assignedSchedules.store";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAssignedSchedules = (searchQuery = "") => {
  const store = useAssignedScheduleStore.getState();

  return useInfiniteQuery< // ✅ Type explicitly
    GetAssignedSchedulesResponse,
    Error,
    GetAssignedSchedulesResponse,
    ["assigned-schedules", string]
  >({
    queryKey: ["assigned-schedules", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      return getAssignedSchedulesApi(pageParam as any, 10, searchQuery);
    },
    getNextPageParam: (lastPage: GetAssignedSchedulesResponse) => lastPage.nextPage,
    onSuccess: (data: InfiniteData<GetAssignedSchedulesResponse>) => {
      const schedules = data.pages.flatMap((page) => page.data);
      store.setSchedules(schedules);
    },
  });
};


export const useUpdateAssignedScheduleStatus = () => {
  const queryClient = useQueryClient();
  const { updateLocalStatus } = useAssignedScheduleStore.getState();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "in-progress" | "completed" | "expired" }) =>
      updateScheduleStatusApi({ id, status }),
    onMutate: ({ id, status }) => {
      // Optimistic update
      updateLocalStatus(id, status);
    },
    onError: (err) => console.error("Failed to update schedule status", err),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-schedules"] });
    },
  });
};
