import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Iuser } from './interfaces/user';
import { apiUserFindMany } from './api/api.user';
import Loader from './components/Loader/Loader';
import { apiAuthMe } from './api/api.auth';
import { toast } from 'react-toastify';
import { toastDefaultConfig } from './config/config';
import { useAuth } from './store/useAuth';

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const {user, setUser, clearUser} = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await apiUserFindMany();
      if (result?.status === 200) {
        setUsers(result.data.data);
      } else if (result?.status === 401) {
        setErrors('пользователь не авторизован');
      } else {
        setErrors('не удалось загрузить список пользователей');
      }
      setLoading(false);
    }

    async function authMe() {
      if (user) {
        return;
      }
      // аутентифицируемся если есть access токен или кука с refresh токеном
      // если есть только кука (как в случае входе через Oauth) - то должен
      // быть interceptor для получения access-токена
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

    authMe();
    load();

  }, []);

  return (
    <main>
      <div className="app">
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <b>Список юзеров (защищенный роут)</b>
            {loading ? <Loader /> : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {errors && <p>{errors}</p>}
            {users.map((item: Iuser) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid black',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px',
                  textAlign: 'left',
                }}
              >
                <div>
                  <b>id: </b> {item.id}
                </div>
                <div><b>name: </b>{item.name}</div>
                <div><b>email: </b>{item.email}</div>
                <div><b>phone: </b>{item.phone}</div>
              </div>
            ))}
          </div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </main>
  );
}

export default App;
