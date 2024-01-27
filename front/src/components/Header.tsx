import { Link } from 'react-router-dom';
import './header.css';
import { useAuth } from '../store/useAuth';

export default function Header() {
  const { user, clearUser } = useAuth();

  return (
    <div className="header_wrapper">
      <Link to="/">
        <img src="./logo.png" alt="Logo" width={400} />
      </Link>
      <ul>
        {/* всегда */}
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/posts">Посты</Link>
        </li>
        {/* если нет регистрации */}
        <li>{!user ? <Link to="/auth">Вход</Link> : ''}</li>
        {/* требует регистрации */}
        <li>{user ? <Link to="/profile">Профиль</Link> : ''}</li>
        {/* требует регистрации */}
        <li>
          {user ? (
            <button onClick={() => clearUser()}>
              Выход {user && user.name}
            </button>
          ) : (
            ''
          )}
        </li>
      </ul>
    </div>
  );
}
