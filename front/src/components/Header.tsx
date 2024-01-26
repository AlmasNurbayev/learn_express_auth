import { Link } from 'react-router-dom';
import './header.css';
import { logout } from '../common/AuthProvider';

export default function Header() {
  const auth = localStorage.getItem('isAuth');
  return (
    <div className="header_wrapper">
      <Link to="/">
        <img src="./logo.png" alt="Logo" width={400} />
      </Link>
      <ul>
        <li>
          <Link to="/auth">Вход</Link>
        </li>
        <li>{auth === 'true' ? <Link to="/profile">Профиль</Link> : ''}</li>
        <li>{auth === 'true' ? <button onClick={() => logout()}>Выход</button> : ''}</li>
      </ul>
    </div>
  );
}
