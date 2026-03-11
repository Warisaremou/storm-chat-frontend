import axios, { type AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (axiosError: AxiosError<{ message?: string; code?: string; field?: string }>) => {
    const apiError: ApiError = {
      message: axiosError.response?.data?.message ?? 'An unexpected error occurred',
      status: axiosError.response?.status ?? 0,
      code: axiosError.response?.data?.code,
      field: axiosError.response?.data?.field,
    };
    return Promise.reject(new Error(apiError.message));
  },
);
