import { useNavigate } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import useAuth from '../contexts/useAuth';
import useTheme from '../contexts/useTheme';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1>AI Chatbot</h1>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        <span className="user-name">
          {user ? user.name : 'User'}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
