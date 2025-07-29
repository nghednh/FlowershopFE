import React from "react";

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label className="block text-black font-bold uppercase mb-1">
      {label} {required && "*"}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 bg-gray-100 text-black p-2 rounded"
      required={required}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);