import axios, { AxiosHeaders } from 'axios';

export async function requestHandler(options: {
  method: string;
  data?: object | undefined;
  url: string;
  params?: object | undefined;
  withCredentials?: boolean | undefined;
  headers?: AxiosHeaders,
}) {
  const { method, data, url, params, withCredentials, headers } = options;
  try {
    const result = await axios({
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
