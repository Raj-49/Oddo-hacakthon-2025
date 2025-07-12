import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-blue-900/60 via-blue-700/40 to-blue-400/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 sm:p-8 min-w-[90vw] sm:min-w-[350px] max-w-md w-full border border-gray-200 animate-fade-in">
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-blue-600 transition-colors text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full bg-white shadow-md p-1"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="mb-4 flex justify-center">
          <div className="h-1 w-16 bg-blue-500 rounded-full" />
        </div>
        {children}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Modal;
