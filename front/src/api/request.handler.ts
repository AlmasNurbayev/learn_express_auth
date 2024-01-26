import axios, { AxiosHeaders,  InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '../store/useAuth';

export async function requestHandler(options: {
  method: string;
  data?: object | undefined;
  url: string;
  params?: object | undefined;
  withCredentials?: boolean | undefined;
  headers?: AxiosHeaders,
}) {
  const { method, data, url, params, withCredentials, headers } = options;
  const axiosInstance = axios.create(); 
  const accessToken = useAuth.getState().accessToken;

  axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
    //config.headers?.setAuthorization(`Bearer ${accessToken}`);
  })

  try {
    
    const result = await axiosInstance({
      method: method,
      url: url,
      data: data,
      params: params,
      withCredentials: withCredentials ? true : undefined,
      headers: headers
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
