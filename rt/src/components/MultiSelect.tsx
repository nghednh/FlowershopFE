import React from "react";

interface MultiSelectProps {
  label: string;
  value: number[];
  onChange: (selectedValues: number[]) => void;
  options: { value: number; label: string }[];
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-black font-bold uppercase mb-1">{label}</label>
    <select
      multiple
      value={value.map(String)}
      onChange={(e) => onChange(Array.from(e.target.selectedOptions, (option) => Number(option.value)))}
      className="w-full border border-gray-300 bg-gray-100 text-black p-2 rounded h-24"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);