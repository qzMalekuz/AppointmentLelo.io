import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export const RoleBasedRoute = ({ allowedRole }: { allowedRole: 'USER' | 'SERVICE_PROVIDER' }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
        // If authenticated but wrong role, send them to their dashboard
        if (role === 'USER') return <Navigate to="/dashboard" replace />;
        if (role === 'SERVICE_PROVIDER') return <Navigate to="/provider/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
