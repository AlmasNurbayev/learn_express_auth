
import { backUrl } from '../config/config';
import { requestHandler } from './request.handler';

export async function apiUserFindMany(id: number | undefined = undefined) {
  return await requestHandler({
    method: 'get',
    url: backUrl + '/user',
    params: {
      id,
    },
  });
}
