import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import TodoListPage from './pages/TodoListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoDetailPage from './pages/TodoDetailPage';

// Tema için import'ları ekleyin
import { ThemeProvider, ThemeToggle, useTheme } from './context/ThemeContext'; // Yolunuzu kontrol edin

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme } = useTheme(); // Temayı useTheme hook'u ile alın

  const noSidebarPaths = ['/login', '/register'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    // Ana div'e tema sınıflarını uygulayın
    // Not: bg-gray-200 burada Light mod için varsayılan arka plan.
    // Dark mod için dark:bg-gray-900 ve text-gray-900 dark:text-gray-100 gibi sınıflar ekledik.
    <div className={`flex h-screen font-sans transition-colors duration-300
      ${showSidebar ? '' : 'justify-center items-center'}
      ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-gray-100'}
    `}>

      {/* Yan Menü (Sidebar) - Sadece showSidebar true ise render edilir */}
      {showSidebar && (
        // Sidebar'a da tema sınıflarını uygulayın
        <aside className={`w-64 flex-shrink-0 shadow-lg rounded-r-lg m-4 flex flex-col transition-colors duration-300
          ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-gray-950 text-gray-100'}
        `}>
          <div className="p-6 flex-grow">
            <h2 className="text-3xl font-bold mb-8 text-indigo-400">TaskFlow</h2>
            <nav>
              <ul>
                {isAuthenticated && (
                  <>
                    <li className="mb-4">
                      <Link
                        to="/dashboard"
                        className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                          location.pathname === '/dashboard'
                            ? (theme === 'light' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-700 text-white shadow-md')
                            : (theme === 'light' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-200')
                        }`}
                      >
                        Ana Sayfa
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/categories"
                        className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                          location.pathname === '/categories'
                            ? (theme === 'light' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-700 text-white shadow-md')
                            : (theme === 'light' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-200')
                        }`}
                      >
                        Kategoriler
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/todos"
                        className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                          location.pathname === '/todos'
                            ? (theme === 'light' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-700 text-white shadow-md')
                            : (theme === 'light' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-200')
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
                  </>
                )}
              </ul>
            </nav>
          </div>

          {/* Hoşgeldin mesajı ve Çıkış Yap butonu - En alta taşıdık */}
          {isAuthenticated && (
            <div className={`p-6 border-t ${theme === 'light' ? 'border-gray-700' : 'border-gray-800'}`}>
              {user && (
                <div className="mb-4">
                  <span className={`block w-full text-left py-2 px-4 text-sm ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Hoşgeldin, {user.name}!
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={logout}
                  className="block flex-grow text-left py-2 px-4 rounded-md transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  Çıkış Yap
                </button>
                {/* Tema değiştirme butonunu buraya ekleyelim */}
                <div className="ml-4">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* Ana İçerik Alanı */}
      <main className={`flex-1 overflow-auto p-6 transition-colors duration-300
        ${!showSidebar ? 'flex items-center justify-center' : ''}
        ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} 
        rounded-lg m-4 shadow-lg
      `}>
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
          {/* Todo Oluşturma Rotası - ID yok */}
          <Route path="/todos/create" element={<ProtectedRoute><TodoDetailPage /></ProtectedRoute>} />

          {/* Todo Detay Görüntüleme Rotası - Sadece göster */}
          <Route path="/todos/detail/:id" element={<ProtectedRoute><TodoDetailPage /></ProtectedRoute>} />

          {/* Todo Düzenleme Rotası - Formu göster */}
          <Route path="/todos/edit/:id" element={<ProtectedRoute><TodoDetailPage /></ProtectedRoute>} />

          <Route
            path="/todos/category/:categoryId"
            element={
              <ProtectedRoute>
                <TodoListPage />
              </ProtectedRoute>
            }
          />

          {/* NotFoundPage'i en sona ekliyoruz, böylece hiçbir rota eşleşmezse bu sayfa gösterilir. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* ToastContainer'ı burada, ana div'in kapanışından hemen önce ekliyoruz */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      {/* AppContent'i ThemeProvider ile sarın */}
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;