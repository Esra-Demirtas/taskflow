// src/pages/NotFoundPage.jsx
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-4">Sayfa Bulunamadı</p>
        <p className="text-gray-500">Aradığınız sayfa mevcut değil.</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;