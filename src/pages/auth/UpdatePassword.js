import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'aws-amplify/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
const UpdatePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        old: "",
        new: "",
        confirm: "",
    });
    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
            setError("Password must be at least 8 characters long.");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least 1 number.");
            setError("Password must contain at least 1 number.");
            return false;
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least 1 lowercase letter.");
            setError("Password must contain at least 1 lowercase letter.");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least 1 uppercase letter.");
            setError("Password must contain at least 1 uppercase letter.");
            return false;
        }
        const specialCharPattern = /[^a-zA-Z0-9 ]/;
        if (!specialCharPattern.test(password)) {
            errors.push("Password must contain at least 1 special character or a space.");
            setError("Password must contain at least 1 special character or a space.");
            return false;
        }
        return true;
    };
    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({ ...prev, [field]: value }));
        if (field === "new" || field === "confirm") {
            const newPassword = field === "new" ? value : passwords.new;
            const confirmPassword = field === "confirm" ? value : passwords.confirm;
            setError(newPassword && confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : "");
        }
    };
    const handleUpdatePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (!validatePassword(passwords.new)) {
            return;
        }
        try {
            setIsLoading(true);
            await updatePassword({ oldPassword: passwords.old, newPassword: passwords.new });
            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
            setPasswords({ old: "", new: "", confirm: "" });
            setIsLoading(false);
        }
        catch (err) {
            setIsLoading(false);
            setError("Failed to update password. Please check your old password and try again.");
            console.error("Password update error:", err);
        }
    };
    const handleSave = () => {
        toast({
            title: "Success",
            description: "Settings saved successfully",
        });
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-2xl text-center", children: "Set a New Password" }), _jsx(CardDescription, { className: "text-center", children: "A new password is required for your account." })] }), _jsxs(CardContent, { children: [error && (_jsx("div", { className: "mb-4 text-red-500 bg-red-100 p-3 rounded", children: error })), _jsxs("form", { onSubmit: handleUpdatePassword, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "oldPassword", children: "Old Password" }), _jsx(Input, { id: "oldPassword", type: "password", placeholder: "Enter your old password", value: passwords.old, onChange: (e) => handlePasswordChange("old", e.target.value), required: true, disabled: isLoading })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "newPassword", children: "New Password" }), _jsx(Input, { id: "newPassword", type: "password", className: "text-gray-100", placeholder: "Enter your new password", value: passwords.new, onChange: (e) => handlePasswordChange("new", e.target.value), required: true, disabled: isLoading }), passwordError && _jsx("p", { className: "text-sm text-red-600", children: passwordError })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm New Password" }), _jsx(Input, { id: "confirmPassword", type: "password", className: "text-gray-100", placeholder: "Re-enter new password", value: passwords.confirm, onChange: (e) => handlePasswordChange("confirm", e.target.value), required: true, disabled: isLoading })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading || passwordError !== '' || !oldPassword || !newPassword || !confirmPassword, children: isLoading ? 'Updating...' : 'Set New Password' })] })] })] }) }));
};
export default UpdatePassword;
