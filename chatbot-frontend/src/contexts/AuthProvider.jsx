import { useState, useEffect } from 'react';
import {jwtDecode }from 'jwt-decode';
import { login as loginAPI } from '../services/api/auth.service';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore auth on load
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(storedToken);

        // Check expiration
        if (decoded.exp * 1000 < Date.now()) {
          clearAuth();
        } else {
          setToken(storedToken);
          setIsAuthenticated(true);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        clearAuth();
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);

      const authToken = response.data.access_token;

      const decoded = jwtDecode(authToken);

      const userData = {
        name: response.data.name,
        email: decoded.sub || credentials.email,
      };

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          'Login failed. Please try again.',
      };
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const logout = () => {
    clearAuth();
  };

  // ⏳ Prevent app render until auth restored
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
