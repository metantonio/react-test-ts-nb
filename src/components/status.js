import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
const STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];
const StatusSelect = ({ value, onChange, label = "Status", placeholder = "Select status", className = "", required = true, }) => {
    return (_jsxs("div", { className: `space-y-1 ${className}`, children: [_jsxs(Label, { children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), _jsxs(Select, { value: value, onValueChange: onChange, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: placeholder }) }), _jsx(SelectContent, { children: STATUS_OPTIONS.map((status) => (_jsx(SelectItem, { value: status.value, children: status.label }, status.value))) })] })] }));
};
export default StatusSelect;
