import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import TodoListPage from './pages/TodoListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const noSidebarPaths = ['/login', '/register'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className={`flex h-screen bg-gray-200 font-sans ${showSidebar ? '' : 'justify-center items-center'}`}>

      {/* Yan Menü (Sidebar) - Sadece showSidebar true ise render edilir */}
      {showSidebar && (
        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg rounded-r-lg m-4 flex flex-col"> {/* flex flex-col ekledik */}
          <div className="p-6 flex-grow"> {/* flex-grow ekledik */}
            <h2 className="text-3xl font-bold mb-8 text-indigo-400">TaskFlow</h2>
            <nav>
              <ul>
                {isAuthenticated && (
                  <>
                    <li className="mb-4">
                      <Link
                        to="/dashboard"
                        className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                          location.pathname === '/dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-700'
                        }`}
                      >
                        Ana Sayfa
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/categories"
                        className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                          location.pathname === '/categories' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-700'
                        }`}
                      >
                        Kategoriler
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/todos"
                        className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                          location.pathname === '/todos' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-700'
                        }`}
                      >
                        Yapılacaklar Listesi
                      </Link>
                    </li>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    {/* Bu kısım normalde showSidebar false olduğunda zaten görünmez */}
                    {/* Ancak burayı da koşullu hale getirmek isteyebilirsiniz */}
                  </>
                )}
              </ul>
            </nav>
          </div>

          {/* Hoşgeldin mesajı ve Çıkış Yap butonu - En alta taşıdık */}
          {isAuthenticated && (
            <div className="p-6 border-t border-gray-700"> {/* Üstte ince bir çizgi ve padding */}
              {user && (
                <div className="mb-4">
                  <span className="block w-full text-left py-2 px-4 text-sm text-gray-400">
                    Hoşgeldin, {user.name}!
                  </span>
                </div>
              )}
              <div>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* Ana İçerik Alanı */}
      <main className={`flex-1 overflow-auto p-6 ${!showSidebar ? 'flex items-center justify-center' : ''}`}>
        <Routes>
          {/* Herkese açık rotalar (kimlik doğrulaması gerektirmez) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* Korumalı rotalar (sadece giriş yapmış kullanıcılar erişebilir) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todos/category/:categoryId"
            element={
              <ProtectedRoute>
                <TodoListPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;