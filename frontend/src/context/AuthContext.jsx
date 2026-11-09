import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spendsmart_user');
    return saved ? JSON.parse(saved) : { name: 'Tarun Kumar', email: 'tarunbjn7@gmail.com' };
  });

  const login = async (email, password) => {
    const res = await apiService.login(email, password);
    setUser(res.data);
    localStorage.setItem('spendsmart_user', JSON.stringify(res.data));
    return res;
  };

  const register = async (name, email, password) => {
    const res = await apiService.register(name, email, password);
    setUser(res.data);
    localStorage.setItem('spendsmart_user', JSON.stringify(res.data));
    return res;
  };

  const logout = () => {
    localStorage.removeItem('spendsmart_token');
    localStorage.removeItem('spendsmart_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
