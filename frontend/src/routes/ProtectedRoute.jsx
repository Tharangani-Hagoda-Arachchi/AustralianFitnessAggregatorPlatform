import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hook';
import Spinner from '../components/Spinner';

export default function ProtectedRoute({ children, roles }) {
    const { isAuthenticated, user, status, token } = useAppSelector((s) => s.auth);
    const location = useLocation();

    // Still verifying the stored token on initial load
    if (token && status === 'loading' && !user) {
        return <Spinner full />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}