import { useInfiniteQuery } from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseInfiniteDataQueryHookProps<TParams = Record<string, unknown>> {
  queryKey: string;
  apiCall: (params: TParams, requestConfig?: AxiosRequestConfig) => Promise<AxiosResponse>;
  filters: Record<string, unknown>;
  rowsPerPage: number;
  sorting: SortingState;
  enabled?: boolean;
  staleTime?: number;
}

export const useInfiniteDataQueryHook = <TParams = Record<string, unknown>>({
  queryKey,
  apiCall,
  filters,
  rowsPerPage,
  sorting,
  enabled = true,
  staleTime = 0,
}: UseInfiniteDataQueryHookProps<TParams>) => {
  return useInfiniteQuery({
    queryKey: [queryKey, filters, rowsPerPage, sorting],
    queryFn: ({ pageParam, signal }) =>
      apiCall(
        {
          ...filters,
          limit: rowsPerPage,
          ...(pageParam && { cursor: pageParam as string }),
          sort: sorting.length > 0 ? (sorting[0].desc ? '-' : '') + sorting[0].id : undefined,
        } as TParams,
        { signal }
      ),
    getNextPageParam: (lastPageResponse) => {
      if (!lastPageResponse.data.cursor) return undefined;
      return lastPageResponse.data.cursor as string;
    },
    initialPageParam: '',
    staleTime,
    enabled,
  });
};
