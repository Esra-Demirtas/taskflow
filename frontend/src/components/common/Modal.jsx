import React from 'react';

const Modal = ({ children, onClose }) => {
  // Modal arka planına tıklandığında kapanmasını sağlamak için
  const handleOverlayClick = (e) => {
    // Eğer tıklanan öğe direkt olarak arka plan div'i ise (içerik değilse)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick} // Arka plana tıklayınca kapanma özelliği
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none focus:outline-none"
          aria-label="Kapat"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;