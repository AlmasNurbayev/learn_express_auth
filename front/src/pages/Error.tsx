import Header from '../components/Header';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: unknown = useRouteError();
  let errorMessage;

  if (isRouteErrorResponse(error)) {
    errorMessage = `status: ${error.status} data: ${error.data} statusText: ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <>
      <Header />
      <div
        style={{
          color: 'darkred',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <h1>Что-то пошло не так....</h1>
        {errorMessage}
      </div>
    </>
  );
}
