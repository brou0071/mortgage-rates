import _axios, { AxiosError } from 'axios';

export const axios = _axios.create({
  baseURL: `/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-nesto-candidat": "David Brousseau",
  },
  timeout: 25000,
});

export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError)?.isAxiosError;
};
