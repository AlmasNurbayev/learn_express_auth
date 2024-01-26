import { Link } from 'react-router-dom';
import './header.css';
import { useAuth } from '../store/useAuth';

export default function Header() {
  const auth = localStorage.getItem('isAuth');
  const { user, clearUser } = useAuth();

  return (
    <div className="header_wrapper">
      <Link to="/">
        <img src="./logo.png" alt="Logo" width={400} />
      </Link>
      <ul>
        <li>{!user ? <Link to="/auth">Вход</Link> : ''}</li>
        <li>{user ? <Link to="/profile">Профиль</Link> : ''}</li>
        <li>{user ? <button onClick={() => clearUser()}>Выход {user && user.name}</button> : ''}</li>
      </ul>
    </div>
  );
}
