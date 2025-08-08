import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import "./MultiSelect.css";
import "./SharedStyles.css";

interface MultiSelectProps {
  label?: string;
  value: number[];
  onChange: (selectedValues: number[]) => void;
  options: { value: number; label: string }[];
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ label, value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOption = (optionValue: number) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const getSelectedLabels = () => {
    if (value.length === 0) return "Select options...";
    if (value.length === 1) {
      const selected = options.find(opt => opt.value === value[0]);
      return selected?.label || "";
    }
    return `${value.length} selected`;
  };

  return (
    <div className={`multiselect-container ${className}`}>
      {label && (
        <label className="multiselect-label">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full inline-block mr-2"></div>
          {label}
        </label>
      )}
      
      <div className="multiselect-wrapper">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="multiselect-button"
          aria-expanded={isOpen}
        >
          <span className={value.length === 0 ? "multiselect-placeholder" : "multiselect-selected-count"}>
            {getSelectedLabels()}
          </span>
          <ChevronDown className="multiselect-icon" />
        </button>

        {isOpen && (
          <div className="multiselect-dropdown custom-scrollbar">
            <div className="p-2">
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className="multiselect-option"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Controlled by parent click
                        className="multiselect-checkbox"
                      />
                      <span className="multiselect-option-label">{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected items display */}
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((selectedValue) => {
            const option = options.find(opt => opt.value === selectedValue);
            return (
              <span
                key={selectedValue}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full border border-purple-200"
              >
                {option?.label}
                <button
                  onClick={() => toggleOption(selectedValue)}
                  className="hover:text-purple-900 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

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