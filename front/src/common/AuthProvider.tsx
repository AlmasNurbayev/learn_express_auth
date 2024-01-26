import { createContext, useContext } from "react";
import { Iuser } from "../interfaces/user";

export const AppContextProvider = ({ children }: {children: React.ReactNode }) => {
  const authContext = createContext({});
  const context = useContext<Partial<Iuser>>(authContext);
  return <authContext.Provider value={context}>{children}</authContext.Provider>;
};

export async function login(user: Iuser, token: string) {
  console.log(user);
  
  localStorage.setItem('userId', String(user.id));
  localStorage.setItem('name', user.name);
  localStorage.setItem('token', token);
  localStorage.setItem('isAuth', 'true');
}

export async function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
  localStorage.removeItem('token');
  localStorage.removeItem('isAuth');
  localStorage.removeItem('address');
  localStorage.removeItem('type');
  localStorage.removeItem('password');
}
