import useAuthStore from '@/stores/auth-store';
import axios, { AxiosRequestConfig } from 'axios';
const API_BASE_URL = '/api/v1';

export default (config: AxiosRequestConfig) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    withCredentials: false,
  });
  instance.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status === 401 || error.response.status === 403) {
        useAuthStore.getState().setAccessToken(null);
        useAuthStore.getState().setIsAuthenticated(false);
      }
      //   console.error('Request failed:', error.response.data.detail!);
      return Promise.reject(error.response.data.detail!);
    }
  );
  return instance(config);
};
