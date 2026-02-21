import { useNavigate, useLocation } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import useAuth from '../contexts/useAuth';
import useTheme from '../contexts/useTheme';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>AI Chatbot</h1>
        <div className="nav-links">
          <button
            className={`nav-link ${isActive('/chat') ? 'active' : ''}`}
            onClick={() => navigate('/chat')}
          >
            Chat
          </button>
          <button
            className={`nav-link ${isActive('/knowledge') ? 'active' : ''}`}
            onClick={() => navigate('/knowledge')}
          >
            Feed Data
          </button>
        </div>
      </div>
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
