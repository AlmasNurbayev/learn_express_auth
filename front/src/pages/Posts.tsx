import { useDeferredValue, useEffect, useState } from 'react';
import { apiDummyGet } from '../api/dummyjson';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader/Loader';

type tPost = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
};

export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<tPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  // const [limit, setLimit] = useState<number>(Number(searchParams.get('limit')) || 10);
  // const [skip, setSkip] = useState<number>(Number(searchParams.get('skip')) || 0);
  const [count, setCount] = useState<number>(0);
  const searchTextDeferred = useDeferredValue(search);

  function changePaiginationParams(paramName: string, value: string | number) {
    searchParams.set(paramName, String(value))
    setSearchParams(searchParams)
  }

  useEffect(() => {
    load();
    console.log('rerender');

    async function load() {
      setLoading(true);
      const result = await apiDummyGet({
        search: searchTextDeferred,
        limit: Number(searchParams.get('limit') || 10),
        //skip: Number(searchParams.get('skip')),
        skip:
          (Number(searchParams.get('page')) - 1) *
          Number(searchParams.get('limit') || 10),
      });
      if (result?.status === 200) {
        setPosts(result.data.products);
        setCount(result.data.total);
      }
      setLoading(false);
    }
  }, [searchParams, searchTextDeferred]);

  return (
    <>
      <div style={{ margin: '0 auto', maxWidth: '800px' }}>
        <div id="title" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <h1>Posts</h1>
          {loading ? <Loader/> : ''}
        </div>
        Нужен для тренировки фильтров, загрузки, ошибок и прочего. Источник
        данных: https://dummyjson.com/
        <div style={{ padding: '30px 0px' }}>
          <label>
            search
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label>
            limit
            <input
              type="number"
              value={Number(searchParams.get('limit')) || 10}
              onChange={(e) => changePaiginationParams('limit', e.target.value)}
            />
          </label>
        </div>
        <Pagination
          count={count}
          limit={Number(searchParams.get('limit')) || 10}
        />
        {posts.map((item) => {
          return (
            <div
              id="item_container"
              key={item.id}
              style={{
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
              }}
            >
              <div id="image_title_container" style={{ display: 'flex' }}>
                <div
                  id="image_container"
                  style={{
                    width: '100px',
                    height: '100px',
                    paddingRight: '10px',
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      borderRadius: '10px',
                    }}
                  ></img>
                </div>
                <h2>{item.title}</h2>
              </div>
              <div>
                <b>description:</b> {item.description}
              </div>
              <div>
                <b>rating: </b> {item.rating}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
