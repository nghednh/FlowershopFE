import React from "react";
import "./Input.css";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  step?: number;
  min?: string | number;
  max?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  placeholder,
  value, 
  onChange, 
  required = false, 
  type = "text", 
  step, 
  min, 
  max, 
  className = "" 
}) => (
  <div className={`input-container ${className}`}>
    {label && (
      <label className="input-label">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full inline-block mr-2"></div>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        required={required}
        step={step}
        min={min}
        max={max}
      />
      {type === "number" && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-400 text-sm">$</span>
        </div>
      )}
    </div>
    {required && !value && (
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
        <span className="text-red-500 text-xs">This field is required.</span>
      </div>
    )}
  </div>
);