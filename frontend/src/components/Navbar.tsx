import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const username =
    localStorage.getItem('username');

  return (
    <header className="navbar">
      <div className="navbar-brand">
        GameHub
      </div>

      <div className="navbar-right">
        <span>{username}</span>

        <button
          className="logout-button"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}