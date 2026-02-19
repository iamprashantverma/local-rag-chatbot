import { useState, useEffect } from 'react';
import { login as loginAPI } from '../services/api/auth.service';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedAuth === 'true') {
      setToken(storedToken);
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      
      const authToken = response.data.access_token;
      const userName = response.data.name;
      
      setToken(authToken);
      setUser({ name: userName, email: credentials.email });
      setIsAuthenticated(true);
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify({ name: userName, email: credentials.email }));
      localStorage.setItem('isAuthenticated', 'true');
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
