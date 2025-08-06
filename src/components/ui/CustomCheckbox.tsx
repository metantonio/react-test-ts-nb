import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label, id }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className={`w-4 h-4 border-2 rounded-sm border-gray-400 flex-shrink-0 mr-2 flex items-center justify-center ${checked ? 'bg-white' : ''}`}>
          {checked && <svg className="w-3 h-3 text-black fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
        </div>
        <span className="text-sm">{label}</span>
      </label>
    </div>
  );
};

export default CustomCheckbox;
