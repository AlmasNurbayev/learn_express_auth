import { useSearchParams } from 'react-router-dom';

export default function Pagination({
  limit = 10,
  count,
}: {
  limit?: number;
  count: number;
}) {
  const [params, setSearchParams] = useSearchParams()
  
  const current: number = Number(params.get('page')) || 1;
  const pagesCount = Math.ceil(count / limit);
  const pagesNumbers = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const handleClick = (pageNumber: number) => {
    params.set("page", String(pageNumber))
    setSearchParams(params);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
      }}
    >
      <button disabled={current === 1 ? true : false} onClick={() => current > 1 ? handleClick(current - 1) : ''}>Previous</button>

      <div>
        {pagesNumbers.map((page) =>
          page <= 3 ||
          Math.abs(current - page) < 3 ||
          Math.abs(pagesNumbers.length - page) < 3 ? (
            <button key={page.toString()} onClick={() => handleClick(page)}
            style={current === page ? {borderStyle: 'solid'} : {}}
            >{page}</button>
          ) : Math.abs(current - page) === 3 ? (
            <button key={page} disabled>
              ...
            </button>
          ) : (
            ''
          )
        )}
      </div>

      <button disabled={current === pagesCount ? true : false} onClick={() => current < 1 ? handleClick(current + 1) : ''}
      >Next</button>
    </div>
  );
}
