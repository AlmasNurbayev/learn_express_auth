import { Link } from 'react-router-dom';
import './header.css';

export default function Header() {
  const auth = localStorage.getItem('isAuth');
  return (
    <div className="header_wrapper">
      <Link to='/'><img src="./logo.png" alt="Logo" width={400} /></Link>
      <Link to="/auth">Вход</Link>
      {auth === 'true' ? <Link to="/profile">Профиль</Link> : ''}
    </div>
  );
}
