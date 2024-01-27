import { useEffect, useState } from 'react';
import { apiAuthMe } from '../api/api.auth';
import { Iuser } from '../interfaces/user';
import { ToastContainer, toast } from 'react-toastify';
import { toastDefaultConfig } from '../config/config';
import Header from '../components/Header';
import { useAuth } from '../store/useAuth';

export default function ProfilePage() {
  const {user, setUser, clearUser} = useAuth();

  useEffect(() => {
    async function load() {
      const res = await apiAuthMe();
      if (res?.status !== 200) {
        toast.error(
          'Не удалось загрузить профиль ' + res.data.error,
          toastDefaultConfig
        );
        clearUser();
      } else {
        setUser(res.data.user);
      }
    }

    load();
  }, []);

  return (
    <>
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
