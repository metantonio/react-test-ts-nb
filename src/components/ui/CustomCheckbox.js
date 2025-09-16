import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CustomCheckbox = ({ checked, onChange, label, id }) => {
    return (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: id, checked: checked, onChange: (e) => onChange(e.target.checked), className: "hidden" }), _jsxs("label", { htmlFor: id, className: "flex items-center cursor-pointer", children: [_jsx("div", { className: `w-4 h-4 border-2 rounded-sm border-gray-400 flex-shrink-0 mr-2 flex items-center justify-center ${checked ? 'bg-white' : ''}`, children: checked && _jsx("svg", { className: "w-3 h-3 text-black fill-current", viewBox: "0 0 20 20", children: _jsx("path", { d: "M0 11l2-2 5 5L18 3l2 2L7 18z" }) }) }), _jsx("span", { className: "text-sm", children: label })] })] }));
};
export default CustomCheckbox;
