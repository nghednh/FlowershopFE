import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./Select.css";
import "./SharedStyles.css";

interface SelectProps {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options, required = false, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSelectedLabel = () => {
    const selected = options.find(opt => opt.value === value);
    return selected?.label || "Select an option...";
  };

  const handleSelect = (optionValue: string | number) => {
    // Create a synthetic event to maintain compatibility with existing onChange handlers
    const syntheticEvent = {
      target: { value: optionValue },
      currentTarget: { value: optionValue }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className={`select-container ${className}`}>
      {label && (
        <label className="select-label">
          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full inline-block mr-2"></div>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="select-wrapper">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="select-input text-left"
          aria-expanded={isOpen}
        >
          <span className={!value || value === '' ? "text-gray-400" : "text-gray-800"}>
            {getSelectedLabel()}
          </span>
          <ChevronDown className={`select-icon ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="select-dropdown custom-scrollbar">
            <div className="p-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`select-option ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="select-option-label">{option.label}</span>
                    {isSelected && (
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};