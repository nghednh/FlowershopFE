import React from "react";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, required = false }) => {
  // Convert ISO string to date input format (YYYY-MM-DD)
  const formatDateForInput = (isoString: string) => {
    if (!isoString) return "";
    return isoString.split('T')[0];
  };

  // Convert date input format to ISO string
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Convert to ISO string with current time or default time
      const isoString = new Date(dateValue + 'T00:00:00.000Z').toISOString();
      onChange({ ...e, target: { ...e.target, value: isoString } });
    } else {
      onChange(e);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-black font-bold uppercase mb-1">
        {label} {required && "*"}
      </label>
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleDateChange}
        className="w-full border border-gray-300 bg-gray-100 text-black p-2 rounded"
        required={required}
      />
    </div>
  );
};