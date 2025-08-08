import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; direction: 'down' | 'up' } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setDropdownPos(null);
  };

  // Tính vị trí dropdown khi mở, tự động chọn hướng
  const updateDropdownPos = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 192; // 12rem, giống max-height trong CSS
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let direction: 'down' | 'up' = 'down';
      let top = rect.bottom + window.scrollY;
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        direction = 'up';
        top = rect.top + window.scrollY - dropdownHeight;
      }
      setDropdownPos({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
        direction
      });
    }
  };

  const handleOpenDropdown = () => {
    updateDropdownPos();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => {
      updateDropdownPos();
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

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
          ref={buttonRef}
          onClick={handleOpenDropdown}
          className="select-input text-left"
          aria-expanded={isOpen}
        >
          <span className={!value || value === '' ? "text-gray-400" : "text-gray-800"}>
            {getSelectedLabel()}
          </span>
          <ChevronDown className={`select-icon ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {/* Dropdown dùng Portal, tự động hướng lên hoặc xuống */}
      {isOpen && dropdownPos && createPortal(
        <>
          <div
            ref={dropdownRef}
            className="select-dropdown custom-scrollbar"
            style={{
              position: 'absolute',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 9999,
              maxHeight: '12rem',
              overflowY: 'auto'
            }}
          >
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
          {/* Click outside để đóng dropdown */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => { setIsOpen(false); setDropdownPos(null); }}
          />
        </>,
        document.body
      )}
    </div>
  );
};