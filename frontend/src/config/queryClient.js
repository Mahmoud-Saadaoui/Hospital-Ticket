import { QueryClient } from "@tanstack/react-query";

const getStatus = (error) => error?.response?.status;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = getStatus(error);

        if ([400, 401, 403, 404].includes(status)) {
          return false;
        }

        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
