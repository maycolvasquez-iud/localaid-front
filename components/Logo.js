import React from 'react';

const Logo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10", 
    large: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Icono */}
      <div className={`${sizeClasses[size]} bg-teal-500 rounded-lg flex items-center justify-center`}>
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-white"
          fill="currentColor"
        >
          {/* Manos sosteniendo corazón */}
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9.5C15 10.3 14.3 11 13.5 11H10.5C9.7 11 9 10.3 9 9.5V7.5L3 7V9C3 9.6 3.4 10 4 10H5V20C5 20.6 5.4 21 6 21H8C8.6 21 9 20.6 9 20V16H15V20C15 20.6 15.4 21 16 21H18C18.6 21 19 20.6 19 20V10H20C20.6 10 21 9.6 21 9Z" />
          {/* Corazón en el centro */}
          <path d="M12 8C11.4 8 10.8 8.2 10.4 8.6C10 8.2 9.4 8 8.8 8C7.7 8 6.8 8.9 6.8 10C6.8 10.4 6.9 10.8 7.1 11.1L12 16L16.9 11.1C17.1 10.8 17.2 10.4 17.2 10C17.2 8.9 16.3 8 15.2 8C14.6 8 14 8.2 13.6 8.6C13.2 8.2 12.6 8 12 8Z" fill="white" />
        </svg>
      </div>
      
      {/* Texto */}
      <span className="text-2xl font-bold text-gray-800">
        LocalAid
      </span>
    </div>
  );
};

export default Logo;
