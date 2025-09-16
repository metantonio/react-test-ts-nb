import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import ConfirmationForm from "./ConfirmationForm";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../../components/ui/card";
const SignUpStep = {
    CONFIRM_SIGN_UP: "CONFIRM_SIGN_UP",
};
const Signup = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        address: "",
        phone: "",
        website: "",
        givenName: "",
        middleName: "",
        familyName: "",
        birthdate: "",
    });
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error)
            setError("");
        if (success)
            setSuccess("");
    };
    const handleCodeChange = (e) => {
        setConfirmationCode(e.target.value);
        if (error)
            setError("");
    };
    const validateForm = () => {
        if (!form.email.trim()) {
            throw new Error("Email is required");
        }
        //const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
        //const emailRegex = /^[^+@]+@[^@]+$/;
        const emailRegex = /^[^@]+@[^@]+$/;
        if (!emailRegex.test(form.email)) {
            throw new Error("Please enter a valid email address with @ and without +");
        }
        /* const usernameRegex = /^[a-zA-Z0-9_@.]+$/;
        if (!usernameRegex.test(form.email)) {
          throw new Error(
            "Username can only contain letters, numbers, and underscores, and @"
          );
        } */
        if (form.password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }
        try {
            validateForm();
            const { isSignUpComplete, nextStep } = await signUp({
                username: form.email,
                password: form.password,
                options: {
                    userAttributes: {
                        email: form.email,
                        given_name: form.givenName,
                        family_name: form.familyName,
                        name: form.givenName,
                        "custom:string": "",
                    },
                },
            });
            if (isSignUpComplete) {
                setSuccess("Account created successfully! You can now log in.");
                setTimeout(() => navigate("/login"), 2000);
            }
            else {
                if (nextStep.signUpStep === SignUpStep.CONFIRM_SIGN_UP) {
                    setShowConfirmation(true);
                    setSuccess("Account created! Please check your email for the confirmation code.");
                }
            }
        }
        catch (err) {
            console.error("Signup error:", err);
            if (err instanceof Error) {
                setError(err.message || "Signup failed. Please try again.");
            }
            else {
                setError("An unknown error occurred during signup.");
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleConfirmSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            if (!confirmationCode.trim()) {
                throw new Error("Please enter the confirmation code");
            }
            const { isSignUpComplete } = await confirmSignUp({
                username: form.email,
                confirmationCode: confirmationCode.trim(),
            });
            if (isSignUpComplete) {
                setSuccess("Email confirmed successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            }
        }
        catch (err) {
            console.error("Confirmation error:", err);
            if (err instanceof Error) {
                setError(err.message || "Confirmation failed. Please check the code and try again.");
            }
            else {
                setError("An unknown error occurred during confirmation.");
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleResendCode = async () => {
        setIsLoading(true);
        setError("");
        try {
            await resendSignUpCode({
                username: form.email,
            });
            setSuccess("Confirmation code resent! Please check your email.");
        }
        catch (err) {
            console.error("Resend code error:", err);
            if (err instanceof Error) {
                setError(err.message || "Failed to resend code. Please try again.");
            }
            else {
                setError("An unknown error occurred while resending the code.");
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    if (showConfirmation) {
        return (_jsx(ConfirmationForm, { email: form.email, error: error, success: success, confirmationCode: confirmationCode, isLoading: isLoading, handleCodeChange: handleCodeChange, handleConfirmSignUp: handleConfirmSignUp, handleResendCode: handleResendCode }));
    }
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: _jsxs(Card, { className: "w-full max-w-lg mx-4 sm:mx-auto", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl", children: "Create Account" }), _jsx(CardDescription, { children: "Enter your details to create a new account." })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "mb-4 text-red-500 bg-red-100 p-3 rounded dark:bg-red-900 dark:text-red-200", children: error })), success && (_jsx("div", { className: "mb-4 text-green-500 bg-green-100 p-3 rounded dark:bg-green-900 dark:text-green-200", children: success })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-1 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "givenName", children: "Given Name" }), _jsx(Input, { id: "givenName", name: "givenName", value: form.givenName, onChange: handleChange, placeholder: "John", required: true, disabled: isLoading })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "familyName", children: "Family Name" }), _jsx(Input, { id: "familyName", name: "familyName", value: form.familyName, onChange: handleChange, placeholder: "Doe", required: true, disabled: isLoading })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "john.doe@example.com", required: true, disabled: isLoading })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "********", required: true, disabled: isLoading })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx(Input, { id: "confirmPassword", name: "confirmPassword", type: "password", value: form.confirmPassword, onChange: handleChange, placeholder: "********", required: true, disabled: isLoading })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Creating Account..." : "Create Account" })] }) }), _jsxs(CardFooter, { className: "flex flex-col items-center space-y-2", children: [_jsxs("small", { className: "text-sm text-muted-foreground", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "font-medium text-primary hover:underline", children: "Sign in" })] }), _jsx(Link, { to: "/", className: "text-sm text-muted-foreground hover:underline", children: "Back to Home" })] })] }) }));
};
export default Signup;
