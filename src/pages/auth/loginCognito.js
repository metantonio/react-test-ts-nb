import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { signIn, getCurrentUser, fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
const LoginCognito = () => {
    const { login, isAuthenticated } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [form, setForm] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [enableRedirect, setEnableRedirect] = useState(false);
    const [showSignUpDialog, setShowSignUpDialog] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error)
            setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (!email.trim() || !password.trim()) {
                throw new Error('Please fill in all fields');
            }
            const { isSignedIn, nextStep } = await signIn({
                username: email,
                password: password,
            });
            if (isSignedIn) {
                const currentUser = await getCurrentUser();
                const session = await fetchAuthSession();
                const idToken = session.tokens?.idToken;
                const userAttributes = await fetchUserAttributes();
                if (!idToken) {
                    throw new Error('No ID token found in session');
                }
                await login(currentUser, idToken.toString(), userAttributes, session);
                const redirectUrl = idToken.payload.website || currentUser.signInDetails?.loginId || '';
                if (redirectUrl && enableRedirect) {
                    let absoluteUrl = `${redirectUrl}/?code=${idToken.payload.jti}`;
                    if (redirectUrl.includes('.') && !redirectUrl.includes('://')) {
                        absoluteUrl = `https://${redirectUrl}/?code=${idToken.payload.jti}`;
                    }
                }
                navigate('/league');
            }
            else {
                handleAuthNextStep(nextStep);
            }
        }
        catch (err) {
            console.error('Login error:', err);
            if (err.name === 'UserNotFoundException' || err.name === 'NotAuthorizedException') {
                setShowSignUpDialog(true);
            }
            else if (err.name === 'NewPasswordRequired') {
                navigate('/updatepassword', { state: { email } });
            }
            else if (err instanceof Error) {
                setError(err.message || 'Login failed. Please check your credentials.');
            }
            else {
                setError('An unknown error occurred during login.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAuthNextStep = (nextStep) => {
        switch (nextStep.signInStep) {
            case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
                navigate('/updatepassword', { state: { email } });
                break;
            case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
                setError('MFA code required. Please implement MFA flow.');
                break;
            case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
                setError('SMS verification required. Please implement SMS flow.');
                break;
            default:
                setError('Additional verification required.');
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex", children: [_jsx("div", { className: "flex-1 flex items-center justify-center bg-white p-8", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Welcome " }), _jsx("p", { className: "text-gray-600 mt-2", children: "Sign in to your NBA Simulator account" })] }), _jsxs(Card, { className: "border-gray-200 shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1", children: [_jsx(CardTitle, { className: "text-2xl text-center text-gray-800", children: "Sign In" }), _jsx(CardDescription, { className: "text-center text-gray-800", children: "Enter your credentials to access your account" })] }), _jsxs(CardContent, { children: [error && (_jsx("div", { className: "mb-4 text-red-500 bg-red-100 p-3 rounded", children: error })), _jsx(AlertDialog, { open: showSignUpDialog, onOpenChange: setShowSignUpDialog, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Account not found" }), _jsx(AlertDialogDescription, { children: "The email or password you entered is incorrect. " })] }), _jsx(AlertDialogFooter, { children: _jsx(AlertDialogCancel, { children: "Cancel" }) })] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2 text-gray-800", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-gray-400" }), _jsx(Input, { id: "email", type: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: "pl-10 text-gray-100", disabled: isLoading, required: true })] })] }), _jsxs("div", { className: "space-y-2 text-gray-800", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-gray-400" }), _jsx(Input, { id: "password", type: showPassword ? "text" : "password", placeholder: "Enter your password", value: password, onChange: (e) => {
                                                                        setPassword(e.target.value);
                                                                        handleChange(e);
                                                                    }, className: "pl-10 pr-10 text-gray-100", disabled: isLoading, required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(EyeOff, { className: "h-3 w-4" }) : _jsx(Eye, { className: "h-3 w-4" }) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { id: "remember", type: "checkbox", className: "rounded border-gray-300" }), _jsx("label", { htmlFor: "remember", className: "text-sm text-gray-600", children: "Remember me" })] }), _jsx("a", { href: "#", className: "text-sm text-navy-600 hover:underline", children: "Forgot password?" })] }), _jsx(Button, { type: "submit", className: "w-full bg-navy-600 hover:bg-navy-700", children: isLoading ? 'Signing In...' : 'Sign In' }), _jsx(Button, { type: "button", className: "w-full bg-navy-600 hover:bg-navy-700", onClick: () => { navigate("/signup"); }, children: "Sign Up" })] })] })] })] }) }), _jsxs("div", { className: "hidden lg:flex lg:w-1/2 casino-gradient flex items-center justify-center p-8 relative overflow-hidden", children: [_jsx("div", { className: "text-center text-white z-10", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "mb-6" }), _jsx("h2", { className: "text-4xl font-bold mb-4", children: "NBA Simulation Platform" }), _jsx("p", { className: "text-xl mb-8 opacity-90", children: "Professional  Simulator" }), _jsx("div", { className: "basketball-to-chart", children: _jsx("div", { className: "basketball", children: _jsx("div", { className: "ball", children: _jsx("div", { className: "lines" }) }) }) })] }) }), _jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [_jsx("div", { className: "absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse" }), _jsx("div", { className: "absolute -bottom-10 -right-10 w-60 h-60 bg-casino-gold opacity-10 rounded-full animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-1/3 -right-20 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-500" }), _jsx("div", { className: "absolute bottom-1/3 -left-20 w-48 h-48 bg-casino-gold opacity-5 rounded-full animate-pulse delay-1500" })] }), _jsx("div", { className: "absolute inset-0 opacity-10", children: _jsx("div", { className: "grid grid-cols-8 grid-rows-8 h-full w-full", children: Array.from({ length: 64 }).map((_, i) => (_jsx("div", { className: "border border-white animate-pulse", style: {
                                    animationDelay: `${i * 50}ms`,
                                    animationDuration: '3s'
                                } }, i))) }) })] })] }));
};
export default LoginCognito;
