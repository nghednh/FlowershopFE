import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", disabled }) => (
  <button
    className={`bg-black text-white uppercase font-semibold py-1 px-2 rounded text-sm hover:bg-gray-800 transition-colors ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);