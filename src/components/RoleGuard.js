import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useUser } from '@/contexts/UserContext';
const RoleGuard = ({ children, permission, fallback = null }) => {
    const { hasPermission, token } = useUser();
    if (!hasPermission(permission)) {
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(_Fragment, { children: children });
};
export default RoleGuard;
