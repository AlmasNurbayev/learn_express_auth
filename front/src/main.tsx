import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import AuthPage from './pages/Auth.tsx';
import PostsPage from './pages/Posts.tsx';
import ErrorPage from './pages/Error.tsx';
import ProfilePage from './pages/Profile.tsx';
import Layout from './Layout.tsx';

const router = createBrowserRouter([
  {
    element: <Layout/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/auth',
        element: <AuthPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/posts',
        element: <PostsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
