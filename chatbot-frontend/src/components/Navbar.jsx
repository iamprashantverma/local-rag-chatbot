import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  console.log(user);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1>AI Chatbot</h1>
      <div className="navbar-right">
        <span className="user-name">
          {user ? `Welcome, ${user.name}` : 'Welcome'}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
