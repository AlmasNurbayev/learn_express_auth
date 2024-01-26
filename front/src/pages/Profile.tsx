import { useEffect, useState } from 'react';
import { apiAuthMe } from '../api/api.auth';
import { Iuser } from '../interfaces/user';
import { ToastContainer, toast } from 'react-toastify';
import { toastDefaultConfig } from '../config/config';
import Header from '../components/Header';
import { logout } from '../common/AuthProvider';

export default function Profile() {
  const [user, setUser] = useState<Iuser>();
  const [error, setError] = useState();

  useEffect(() => {
    async function load() {
      const res = await apiAuthMe();
      if (res?.status !== 200) {
        toast.error(
          'Не удалось загрузить профиль ' + res.data.error,
          toastDefaultConfig
        );
        setError(res.data.error);
        logout();
      } else {
        setUser(res.data.user);
      }
    }

    load();
  }, []);

  return (
    <>
      <Header/>
      <ToastContainer />
      Profile
      {user && (
        <div>
          <p>user.id: {user.id}</p>
          <p>user.name: {user.name}</p>
          <p>user.email: {user.email}</p>
          <p>user.phone: {user.phone}</p>
        </div>
      )}
      {!user && <p>Пользователь не авторизован</p>}
    </>
  );
}
