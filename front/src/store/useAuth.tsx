import { create } from 'zustand';
import { Iuser } from '../interfaces/user';
import { devtools } from 'zustand/middleware';

export interface IuseAuth {
  user: Iuser | null;
  accessToken: string;
  setUser: (user: Iuser) => void;
  clearUser: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuth = create<IuseAuth>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: '',
      setUser: (user: Iuser) => {
        set({ user: user }, false, 'setUser');
      },
      clearUser: () => {
        set({ user: null }, false, 'clearUser');
      },
      setAccessToken: (token: string) => {
        set({ accessToken: token }, false, 'setAccessToken');
      },
    }),
    { name: 'useAuth' }
  )
);
