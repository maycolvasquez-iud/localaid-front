import React from 'react';

const Logo = ({ className = "", size = "default", showText = true }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8", 
    large: "w-10 h-10",
    xl: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
    xl: "text-3xl"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Heart Icon */}
      <svg
        className={`${sizeClasses[size]} mr-2`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#00BCD4"
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>
      
      {/* Text */}
      {showText && (
        <span className={`font-bold text-gray-800 ${textSizeClasses[size]}`}>
          LocalAid
        </span>
      )}
    </div>
  );
};

export default Logo;
