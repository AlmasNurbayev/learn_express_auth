import axios from "axios";

export async function requestHandler(method: string, data: object | undefined, url: string, params: object | undefined) {
  try {
    const result = await axios({
      method: method,
      url: url,
      data: data,
      params: params
    });
    return { status: result.status, data: result.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('isAxiosError');
      
      return { status: error.response?.status, data: error.response?.data };
    } else {
      return { status: 500, data: error };
    }
  }

}