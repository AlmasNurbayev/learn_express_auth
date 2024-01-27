import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '../store/useAuth';
import { apiAuthRefresh } from './api.auth';

export async function requestHandler(options: {
  method: string;
  data?: object | undefined;
  url: string;
  params?: object | undefined;
  withCredentials?: boolean | undefined;
  headers?: AxiosHeaders;
}) {
  const { method, data, url, params, withCredentials, headers } = options;
  const axiosInstance = axios.create();
  const setAccessToken = useAuth.getState().setAccessToken;
  const getAccessToken = useAuth.getState().getAccessToken;

  axiosInstance.interceptors.response.use(
    (config) => {
      return config;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        error.config &&
        !error.config._isRetry
      ) {
        console.log('401');
        originalRequest._isRetry = true;
        try {
          const result = await apiAuthRefresh();
          console.log('result', result);
          if (result.status === 200) {
            setAccessToken(result.data.accessToken);
            console.log('set accessToken', result.data.accessToken);
          }
          return axiosInstance.request(originalRequest);
        } catch (e) {
          console.log('НЕ АВТОРИЗОВАН');
        }
      }
      throw error;
    }
  );
 

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (config.headers) {
        const token = getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('get token', token);
      }
      return config;
      //config.headers?.setAuthorization(`Bearer ${accessToken}`);
    }
  );

  try {
    const result = await axiosInstance({
      method: method,
      url: url,
      data: data,
      params: params,
      withCredentials: withCredentials ? true : undefined,
      headers: headers,
    });
    return { status: result.status, data: result.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      //console.log('isAxiosError');
      return { status: error.response?.status, data: error.response?.data };
    } else {
      return { status: 500, data: error };
    }
  }
}
