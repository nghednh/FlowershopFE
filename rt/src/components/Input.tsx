import React from "react";

interface InputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, required = false, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-black font-bold uppercase mb-1">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 bg-gray-100 text-black p-2 rounded"
      required={required}
    />
    {required && !value && (
      <span className="text-red-500 text-sm mt-1 block">This field is required.</span>
    )}
  </div>
);