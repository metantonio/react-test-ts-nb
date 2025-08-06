import React from 'react';

interface CustomRadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ name, value, checked, onChange, label, id }) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="hidden"
      />
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="w-4 h-4 border-2 rounded-full border-gray-400 flex-shrink-0 mr-2 flex items-center justify-center">
          {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
        <span className="text-sm">{label}</span>
      </label>
    </div>
  );
};

export default CustomRadio;
