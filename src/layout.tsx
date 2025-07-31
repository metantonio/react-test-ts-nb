import React, {useEffect} from "react";
import { BrowserRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
//import { UserProvider } from "@/contexts/UserContext";

//Import of views or components:
import App from "./App";
import LoginAPI from "./LoginAPI";

// Layouts
import AuthLayout from "./components/LoginLayout";
import DashboardLayout from "./components/MainLayout";

const queryClient = new QueryClient();

/* const REACT_APP_COGNITO_USER_POOL_ID = import.meta.env.VITE_APP_COGNITO_USER_POOL_ID;
const REACT_APP_COGNITO_CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
const REACT_APP_COGNITO_DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN; */

const AppContent = () => {

    const location = useLocation();
    const isAuthRoute = location.pathname.startsWith("/login") || location.pathname === "/";

    const Layout = isAuthRoute ? AuthLayout : DashboardLayout;
    useEffect(()=> {
        console.log("location:", location)
    },[])
    /* 
    const amplifyConfig: ResourcesConfig = {
      Auth: {
        Cognito: {
          userPoolId: REACT_APP_COGNITO_USER_POOL_ID || '',
          userPoolClientId: REACT_APP_COGNITO_CLIENT_ID || '',
          loginWith: {
            oauth: {
              domain: REACT_APP_COGNITO_DOMAIN || '',
              scopes: ['email', 'profile', 'openid'],
              redirectSignIn: [window.location.origin + '/login', 'http://localhost:3000/adminpanel/login'],
              redirectSignOut: [window.location.origin + '/login', 'http://localhost:3000/adminpanel/login'],
              responseType: 'code',
            },
          },
        },
      },
    };
  
    Amplify.configure(amplifyConfig); */

    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/" element={<LoginAPI />} />
                <Route path="*" element={<LoginAPI />} />
            </Routes>
        </Layout>
    );
};

const AppLayout = () => (
    <QueryClientProvider client={queryClient}>
        <UserProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <SidebarProvider>
                        <AppContent />
                    </SidebarProvider>
                </BrowserRouter>
            </TooltipProvider>
        </UserProvider>
    </QueryClientProvider>
);

export default AppLayout;