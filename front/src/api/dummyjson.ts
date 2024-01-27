import { requestHandler } from './request.handler';

export async function apiDummyGet({
  search,
  limit,
  skip,
}: {
  search?: string;
  limit?: number;
  skip?: number;
}) {
  return await requestHandler({
    method: 'get',
    url: 'https://dummyjson.com/products/search/',
    params: {
      q: search, limit, skip
    },
  });
}
