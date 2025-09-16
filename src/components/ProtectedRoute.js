import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
const ProtectedRoute = ({ children, permission, redirectTo = "/" }) => {
    const { hasPermission, token } = useUser();
    if (!hasPermission(permission) || !token) {
        return _jsx(Navigate, { to: redirectTo, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
