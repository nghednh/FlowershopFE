import React from "react";

interface TimePickerProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange, required = false }) => (
    <div className="mb-4">
        <label className="block text-black font-bold uppercase mb-1">
            {label} {required && "*"}
        </label>
        <input
            type="time"
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 bg-gray-100 text-black p-2 rounded"
            required={required}
        />
    </div>
);