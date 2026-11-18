import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin as apiLogin, logoutAdmin as apiLogout, getAdminProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('glowroot_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getAdminProfile();
      if (res.data?.success) {
        setAdmin(res.data.admin);
      } else {
        localStorage.removeItem('glowroot_admin_token');
        setAdmin(null);
      }
    } catch (err) {
      localStorage.removeItem('glowroot_admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await apiLogin({ username, password });
    if (res.data?.success) {
      localStorage.setItem('glowroot_admin_token', res.data.token);
      setAdmin(res.data.admin);
      return { success: true };
    }
    return { success: false, message: res.data?.message || 'Login failed' };
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // Continue client cleanup even if network fails
    }
    localStorage.removeItem('glowroot_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
