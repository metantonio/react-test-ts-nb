import React, {useEffect} from "react";
import { HashRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { ApiProvider } from "@/contexts/ApiContext";

//Import of views or components:
import App from "./App";
import LoginAPI from "./LoginAPI";
import GameSetup from "./pages/GameSetup";

// Layouts
import AuthLayout from "./components/LoginLayout";
import DashboardLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const AppContent = () => {

    const location = useLocation();
    const isAuthRoute = location.pathname.startsWith("/login") || location.pathname === "/";

    const Layout = isAuthRoute ? AuthLayout : DashboardLayout;
    useEffect(()=> {
        console.log("location:", location)
    },[])

    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/" element={<LoginAPI />} />
                <Route path="/league" element={<GameSetup />} />
                <Route path="*" element={<LoginAPI />} />
            </Routes>
        </Layout>
    );
};

const AppLayout = () => (
    <QueryClientProvider client={queryClient}>
        <UserProvider>
            <ApiProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <HashRouter>
                    <SidebarProvider>
                        <AppContent />
                    </SidebarProvider>
                </HashRouter>
                </TooltipProvider>
            </ApiProvider>
        </UserProvider>
    </QueryClientProvider>
);

export default AppLayout;