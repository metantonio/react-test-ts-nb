import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, // <-- import the hook
 } from "@/components/ui/sidebar";
import { Home, Building2, Users, Settings, BarChart3, ChevronLeft, ChevronRight, } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
const menuItems = [
    { title: "Dashboard", url: "/adminpanel", icon: Home, permission: "view_all" },
    { title: "Casinos", url: "/adminpanel/casinos", icon: Building2, permission: "view_all" },
    { title: "Users", url: "/adminpanel/users", icon: Users, permission: "add_edit_delete_users" },
    { title: "Analytics", url: "/adminpanel/analytics", icon: BarChart3, permission: "view_all" },
    { title: "Settings", url: "/adminpanel/settings", icon: Settings, permission: "view_all" },
];
export function AppSidebar() {
    const location = useLocation();
    const { user } = useUser();
    const { state, toggleSidebar } = useSidebar(); // use sidebar context
    const [hide, setHide] = useState(true);
    return (_jsx(_Fragment, { children: hide ? _jsx(_Fragment, {}) : _jsx(_Fragment, { children: _jsxs(Sidebar, { collapsible: "icon", className: "border-r border-navy-200", "data-collapsed": state === "collapsed", children: [_jsx(SidebarHeader, { className: "p-6 border-b border-navy-200", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3 group-data-[collapsible=icon]:justify-center", children: [_jsx("img", { src: "/casino-vision-uploads/casino-logo.png", alt: "CasinoVizion", className: "w-10 h-10 rounded-full flex-shrink-0" }), _jsxs("div", { className: "group-data-[collapsible=icon]:hidden", children: [_jsx("h2", { className: "text-lg font-bold text-sidebar-foreground", children: "CasinoVizion" }), _jsx("p", { className: "text-sm text-sidebar-foreground/70", children: "Admin Panel" }), user && (_jsxs("span", { className: "text-xs text-sidebar-foreground/50", children: [user.role.charAt(0).toUpperCase() + user.role.slice(1), " Access"] }))] })] }) }) }), _jsx(SidebarContent, { children: _jsxs(SidebarGroup, { children: [_jsx(SidebarGroupLabel, { className: "text-sidebar-foreground/70 font-medium group-data-[collapsible=icon]:sr-only", children: "Management" }), _jsx(SidebarGroupContent, { children: _jsx(SidebarMenu, { children: menuItems.map((item) => (_jsx(SidebarMenuItem, { children: _jsx(SidebarMenuButton, { asChild: true, isActive: location.pathname === item.url, className: "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", children: _jsxs(Link, { to: item.url, children: [_jsx(item.icon, { className: "w-4 h-4" }), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: item.title })] }) }) }, item.title))) }) })] }) }), _jsxs(SidebarFooter, { className: "p-4 border-t border-navy-200", children: [_jsx("div", { className: "text-xs text-sidebar-foreground/50 text-center group-data-[collapsible=icon]:sr-only", children: "\u00A9 2025 CasinoVizion" }), _jsx("div", { className: "flex justify-center mt-2", children: _jsx("button", { onClick: toggleSidebar, className: "bg-sidebar-accent text-sidebar-accent-foreground rounded-full p-2 hover:bg-sidebar-accent/90 transition", "aria-label": state === "collapsed" ? "Expand sidebar" : "Collapse sidebar", children: state === "collapsed" ? _jsx(ChevronRight, { className: "w-4 h-4" }) : _jsx(ChevronLeft, { className: "w-4 h-4" }) }) })] })] }) }) }));
}
