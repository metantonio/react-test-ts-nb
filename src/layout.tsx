import React, { useEffect } from "react";
import { HashRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { ApiProvider } from "@/contexts/ApiContext";
import { Amplify } from 'aws-amplify';

//Import of views or components:
import App from "./App";
import LoginAPI from "./LoginAPI";
import GameSetup from "./pages/GameSetup";
import LoginCognito from "./pages/auth/loginCognito";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Signup from "./pages/auth/signup";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import AuthLayout from "./components/LoginLayout";
import DashboardLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const REACT_APP_COGNITO_USER_POOL_ID = import.meta.env.VITE_APP_COGNITO_USER_POOL_ID;
const REACT_APP_COGNITO_CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
const REACT_APP_COGNITO_DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;

const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: REACT_APP_COGNITO_USER_POOL_ID || '',
            userPoolClientId: REACT_APP_COGNITO_CLIENT_ID || '',
            loginWith: {
                oauth: {
                    domain: REACT_APP_COGNITO_DOMAIN || '',
                    scopes: ['email', 'profile', 'openid'],
                    redirectSignIn: [window.location.origin + '/login', 'http://localhost:5173/login'],
                    redirectSignOut: [window.location.origin + '/login', 'http://localhost:5173/login'],
                    responseType: 'code' as const,
                },
            },
        },
    },
};

Amplify.configure(amplifyConfig);

const AppContent = () => {
    const { isLoading } = useUser();
    const location = useLocation();
    const isAuthRoute = location.pathname.startsWith("/login") || location.pathname === "/";

    const Layout = isAuthRoute ? AuthLayout : DashboardLayout;

    useEffect(() => {
        console.log("location:", location)
    }, [])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Navigate to="/" replace />} />
                {/* <Route path="/" element={<LoginAPI />} /> */}
                <Route path="/" element={<LoginCognito />} />

                <Route path="/league" element={
                    <ProtectedRoute permission="view_all">
                        <GameSetup />
                    </ProtectedRoute>}
                />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route path="*" element={<LoginAPI />} /> */}
                <Route path="*" element={<LoginCognito />} />
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