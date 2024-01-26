import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Header from './components/Header';
import { Iuser } from './interfaces/user';
import { apiUserFindMany } from './api/api.user';
import { useAuth } from './store/useAuth';

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState('');
  
  useEffect(() => {
    async function load() {
      const result = await apiUserFindMany();
      if (result?.status === 200) {
        setUsers(result.data.data);
      } else if (result?.status === 401) {
        setErrors('пользователь не авторизован');
      } else {
        setErrors('не удалось загрузить список пользователей');
      }
    }
    load();
  }, [])

  return (
    <>
      <Header />
      <div className="app">
        <div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {errors && <p>{errors}</p>}
            {users.map((item: Iuser) => (
              <ul key={item.id}>
                <li>{item.id}</li>
                <li>{item.name}</li>
                <li>{item.email}</li>
                <li>{item.phone}</li>
              </ul>
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
    </>
  );
}

export default App;
