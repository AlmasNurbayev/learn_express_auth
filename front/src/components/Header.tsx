import { Link } from 'react-router-dom';
import './header.css';
import { useAuth } from '../store/useAuth';

export default function Header() {
  const { user, clearUser } = useAuth();

  return (
    <header className="header_wrapper">
      <Link to="/">
        <img src="./logo.png" alt="Logo" width={400} />
      </Link>
      {/* всегда */}
      <div className="link">
        <Link to="/">Главная</Link>
      </div>

      <div className="link">
        <Link to="/posts">Посты</Link>
      </div>

      {/* если нет регистрации */}
      {!user ? (
        <div className="link">
          <Link to="/auth">Вход</Link>
        </div>
      ) : (
        ''
      )}
      {/* требует регистрации */}
      {user ? (
        <div className="link">
          <Link to="/profile">Профиль</Link>
        </div>
      ) : (
        ''
      )}
      {/* требует регистрации */}
      {user ? (
        <div className="link" onClick={() => clearUser()}>
          Выход {user && user.name}
        </div>
      ) : (
        ''
      )}
    </header>
  );
}
