// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // AuthContext'i içeri aktar

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth(); // AuthContext'ten gerekli state'leri çek
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Çıkış yaptıktan sonra giriş sayfasına yönlendir
  };

  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold hover:text-indigo-200 transition-colors duration-200">
          Todo Yönetimi
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-indigo-200 transition-colors duration-200">Dashboard</Link>
                </li>
                <li>
                  <Link to="/todos" className="hover:text-indigo-200 transition-colors duration-200">Todolar</Link>
                </li>
                {/* İstersen kategoriler sayfasını ekle */}
                {/* <li>
                  <Link to="/categories" className="hover:text-indigo-200 transition-colors duration-200">Kategoriler</Link>
                </li> */}
                <li className="text-indigo-200">Merhaba, {user?.name || 'Kullanıcı'}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-indigo-200 transition-colors duration-200">Giriş Yap</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-indigo-200 transition-colors duration-200">Kayıt Ol</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;