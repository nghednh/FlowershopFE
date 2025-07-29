import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    className={`bg-black text-white uppercase font-semibold py-2 px-4 rounded hover:bg-gray-800 transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);