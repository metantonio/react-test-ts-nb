import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
const ProfileDropdown = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    if (!user)
        return null;
    const handleRoleSwitch = () => {
        // Mock role switching for demo purposes
        const mockUsers = {
            admin: { id: '1', username: 'Admin User', email: 'admin@casinovizion.com', role: 'admin' },
            developer: { id: '2', username: 'Dev User', email: 'developer@casinovizion.com', role: 'developer' },
            guest: { id: '3', username: 'Guest User', email: 'guest@casinovizion.com', role: 'guest' }
        };
        // For demo, we'll update the user context
        window.location.reload(); // Simple way to simulate role change
    };
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'developer': return 'bg-blue-100 text-blue-800';
            case 'guest': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "relative h-10 w-10 rounded-full", children: _jsx(Avatar, { className: "h-10 w-10", children: _jsx(AvatarFallback, { className: "bg-navy-100 text-navy-600", children: user.username.split(' ').map(n => n[0]).join('').toUpperCase() }) }) }) }), _jsxs(DropdownMenuContent, { className: "w-80 bg-white border border-gray-200 shadow-lg", align: "end", forceMount: true, children: [_jsx(DropdownMenuLabel, { className: "font-normal", children: _jsx("div", { className: "flex flex-col space-y-2", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { className: "h-12 w-12", children: _jsx(AvatarFallback, { className: "bg-navy-100 text-navy-600", children: user.username.split(' ').map(n => n[0]).join('').toUpperCase() }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium leading-none", children: user.username }), _jsx("p", { className: "text-xs leading-none text-gray-600 mt-1", children: user.email }), _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(user.role)}`, children: user.role.charAt(0).toUpperCase() + user.role.slice(1) })] })] }) }) }), _jsx(DropdownMenuSeparator, {}), user.role === 'admin' && (_jsxs(_Fragment, { children: [_jsx(DropdownMenuLabel, { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Switch Role" }), _jsxs(DropdownMenuItem, { onClick: () => handleRoleSwitch(), className: "cursor-pointer", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Admin" })] }), _jsxs(DropdownMenuItem, { onClick: () => handleRoleSwitch(), className: "cursor-pointer", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Developer" })] }), _jsxs(DropdownMenuItem, { onClick: () => handleRoleSwitch(), className: "cursor-pointer", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Guest" })] })] })), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "cursor-pointer", onClick: () => navigate("/adminpanel/settings?tab=security"), children: [_jsx(Lock, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Reset Password" })] }), _jsxs(DropdownMenuItem, { className: "cursor-pointer text-red-600", onClick: async () => {
                            await logout();
                            navigate("/adminpanel/login");
                        }, children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Logout" })] })] })] }));
};
export default ProfileDropdown;
