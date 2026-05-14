import type { DefaultError, QueryKey, QueryClient } from '@tanstack/query-core';
import {
  useQuery,
} from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UndefinedInitialDataOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { isAxiosError } from '../axios/instance';

export type InfiniteQueryOptions<
  TQueryFnData extends readonly unknown[] = readonly unknown[],
  TError = unknown,
  TData = TQueryFnData,
> = Omit<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData>,
  'queryFn' | 'queryKey' | 'onSuccess'
> & {
  onSuccess?: (data: unknown) => void;
};
export type QueryOptions = Omit<UseQueryOptions<unknown, unknown, unknown, QueryKey>, 'queryFn' | 'queryKey'>;

/** Small note, left off the error responses from Remediations as they are identical */
export type APIErrorStatus<ErrorResponse = object> = {
  data: ErrorResponse;
  status?: number;
  headers?: unknown;
  url?: [method?: string, URI?: string];
  errorType: string;
};

export const catchAPIErrorAndLog = (msg: string, errorType: string) => (error: Error) => {
  let resp: APIErrorStatus;
  if (isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      resp = {
        status: error.response.status,
        url: [error.config?.method, error.config?.url],
        data: error.response.data as object,
        headers: error.response.headers,
        errorType,
      };
      console.warn(`${msg}: received 4xx/5xx response`, resp);
    } else {
      // The request was made but no response was received
      resp = {
        url: [error.config?.method, error.config?.url],
        data: { message: error.message },
        errorType,
      };
      console.warn(`${msg}: no response received`, resp);
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    resp = { data: { message: (error as Error | undefined)?.message ?? '' }, errorType };
    console.warn(`${msg}: no request made`);
    console.warn(error);
  }

  throw resp;
};

export const useAxiosQuery = <
  TQueryFnData extends AxiosResponse<unknown> = AxiosResponse<unknown>,
  TError = DefaultError,
  TData = TQueryFnData['data'],
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseQueryResult<TData, TError> => {
  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>(
    options,
    queryClient,
  );
  return query;
};
