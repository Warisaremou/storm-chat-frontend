import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => config);

apiClient.interceptors.response.use(
  (response) => response,
  async (axiosError: AxiosError<{ error?: string; message?: string }>) => {
    const config = (axiosError.config as RetryConfig) ?? {};
    const url = config.url ?? '';
    const isRefreshCall = url.includes('/users/auth/refresh');
    const isLoginCall = url.includes('/users/auth/login');

    if (axiosError.response?.status === 401 && !config._retry && !isRefreshCall && !isLoginCall) {
      config._retry = true;
      try {
        await apiClient.post('/users/auth/refresh', {}, { withCredentials: true });
        return apiClient.request(config);
      } catch {
        throw new Error('Session expired');
      }
    }

    const message =
      axiosError.response?.data?.error ??
      axiosError.response?.data?.message ??
      'An unexpected error occurred';

    throw new Error(message);
  },
);
