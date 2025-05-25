import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_BASE_URL = 'http://localhost:8000/api'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log('401 Unauthorized: Logging out...');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]); 

  const fetchUser = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` } 
        });
        setUser(response.data);
      } catch (error) {
        console.error('Kullanıcı bilgileri çekilirken hata oluştu:', error);
        localStorage.removeItem('token'); 
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]); 

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Giriş hatası:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Giriş başarısız.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      const { access_token, user: newUserData } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(newUserData);
      return { success: true };
    } catch (error) {
      console.error('Kayıt hatası:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Kayıt başarısız.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Çıkış yapılırken backend hatası:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!user && !!token; 

  const authContextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};