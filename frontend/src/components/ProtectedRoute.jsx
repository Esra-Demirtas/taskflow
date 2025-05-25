// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthContext'i içeri aktardığımızdan emin olun

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // AuthContext'ten oturum durumu ve yükleme durumunu al

  // Eğer AuthContext hala kullanıcı bilgilerini yüklüyorsa, bir yükleme göstergesi döndür.
  // Bu, sayfa yenilendiğinde veya ilk yüklendiğinde, token'ın kontrol edilmesi için önemlidir.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">Yükleniyor...</p>
      </div>
    );
  }

  // Eğer kullanıcı kimliği doğrulanmamışsa (isAuthenticated false ise),
  // onu login sayfasına yönlendir.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Eğer kullanıcı kimliği doğrulanmışsa, children (korunan bileşenleri) render et.
  return children;
};

export default ProtectedRoute;