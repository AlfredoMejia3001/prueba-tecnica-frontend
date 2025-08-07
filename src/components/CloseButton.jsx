import React from 'react';

const CloseButton = ({ 
  onClick, 
  className = "absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all shadow-sm",
  size = "text-lg",
  ariaLabel = "Cerrar"
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      <span className={`font-bold leading-none ${size}`}>×</span>
    </button>
  );
};

export default CloseButton;
