// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthContext yolunu kontrol edin

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Kimlik doğrulama durumu yükleniyorsa bir yüklenme göstergesi gösterebilirsiniz
    return <div className="flex justify-center items-center h-screen text-lg">Yükleniyor...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;