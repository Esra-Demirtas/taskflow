import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== passwordConfirmation) {
      setError('Şifreler eşleşmiyor!');
      setLoading(false);
      return;
    }

    const result = await register({ name, email, password, password_confirmation: passwordConfirmation }); 
    
    if (result.success) {
      navigate('/dashboard'); 
    } else {
      if (result.message && typeof result.message === 'object') {
        const errors = Object.values(result.message).flat().join(' ');
        setError(errors);
      } else {
        setError(result.message || 'Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* FORM KUTUSU KAPSAYICISI - EŞİTLENMİŞ */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"> 
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2"> {/* font-bold yerine font-medium */}
              Ad Soyad:
            </label>
            {/* INPUT ALANI - EŞİTLENMİŞ */}
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2"> {/* font-bold yerine font-medium */}
              E-posta:
            </label>
            {/* INPUT ALANI - EŞİTLENMİŞ */}
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2"> {/* font-bold yerine font-medium */}
              Şifre:
            </label>
            {/* INPUT ALANI - EŞİTLENMİŞ */}
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-medium mb-2"> {/* font-bold yerine font-medium */}
              Şifre Tekrar:
            </label>
            {/* INPUT ALANI - EŞİTLENMİŞ */}
            <input
              type="password"
              id="password_confirmation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> {/* Flex düzeni eklendi */}
            {/* KAYIT OL BUTONU - EŞİTLENMİŞ */}
            <button
              type="submit"
              className={`w-full sm:w-auto flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition transform duration-200 ease-in-out ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
              disabled={loading}
            >
              {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
            </button>
            {/* ZATEN HESABIN VAR MI? GİRİŞ YAP BUTONU - EŞİTLENMİŞ */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto text-center font-medium text-indigo-600 hover:text-indigo-800 transition duration-200 ease-in-out text-sm py-3 px-6 rounded-lg hover:bg-indigo-50"
            >
              Zaten hesabın var mı? Giriş yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;