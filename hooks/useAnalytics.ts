import { getAnalyticsApi } from '@/api/analytics.api';
import { AnalyticsResponse, useAnalyticsStore } from '@/store/analytics.store';
import { useQuery } from '@tanstack/react-query';

export const useAnalytics = () => {
    const { selectedMonth, selectedYear, setAnalytics } = useAnalyticsStore();

    // single object pattern (React Query v4)
    return useQuery<AnalyticsResponse, Error>({
        queryKey: ['analytics', selectedMonth, selectedYear],
        queryFn: async (): Promise<AnalyticsResponse> => {
            const data = await getAnalyticsApi(selectedMonth, selectedYear);

            // persist to Zustand store
            setAnalytics(data);

            return data;
        },
        // keepPreviousData: true,
    });
};
