import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/layouts/DashboardLayout.jsx
import { AppSidebar } from "./AppSidebar";
import { useUser } from "@/contexts/UserContext";
const DashboardLayout = ({ children }) => {
    const { logout } = useUser();
    return (_jsxs("div", { className: "min-h-screen flex w-full", children: [_jsx(AppSidebar, {}), _jsx("div", { className: "flex flex-col flex-1", children: _jsx("main", { className: "flex-1 overflow-auto", children: children }) })] }));
};
export default DashboardLayout;
