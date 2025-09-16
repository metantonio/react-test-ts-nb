import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CustomRadio = ({ name, value, checked, onChange, label, id }) => {
    return (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "radio", id: id, name: name, value: value, checked: checked, onChange: () => onChange(value), className: "hidden" }), _jsxs("label", { htmlFor: id, className: "flex items-center cursor-pointer", children: [_jsx("div", { className: "w-4 h-4 border-2 rounded-full border-gray-400 flex-shrink-0 mr-2 flex items-center justify-center", children: checked && _jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) }), _jsx("span", { className: "text-sm", children: label })] })] }));
};
export default CustomRadio;
