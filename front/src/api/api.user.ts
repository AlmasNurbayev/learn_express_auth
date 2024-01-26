import { AxiosHeaders } from "axios";
import { backUrl } from "../config/config";
import { Iuser } from "../interfaces/user";
import { useAuth } from "../store/useAuth";
import { requestHandler } from "./request.handler";



export async function apiUserGetMany(
  id: number | undefined = undefined,
  accessToken: string,
) {
  const headers = new AxiosHeaders();
  return await requestHandler({
    method: 'get',
    url: backUrl + '/user',
    params: {
      id
    },
    headers: headers.set('Authorization', `Bearer ${accessToken}`),
  });
}