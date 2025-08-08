import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; direction: 'down' | 'up' } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          ref={buttonRef}
          onClick={handleOpenDropdown}
          className="multiselect-button"
          aria-expanded={isOpen}
        >
          <span className={value.length === 0 ? "multiselect-placeholder" : "multiselect-selected-count"}>
            {getSelectedLabels()}
          </span>
          <ChevronDown className="multiselect-icon" />
        </button>
      </div>
      {/* Dropdown dùng Portal, tự động hướng lên hoặc xuống */}
      {isOpen && dropdownPos && createPortal(
        <>
          <div
            ref={dropdownRef}
            className="multiselect-dropdown custom-scrollbar"
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
          {/* Click outside để đóng dropdown */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => { setIsOpen(false); setDropdownPos(null); }}
          />
        </>,
        document.body
      )}
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
    </div>
  );
};