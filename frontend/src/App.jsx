import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import { useAppDispatch, useAppSelector } from './app/hook';
import { fetchMe, logout } from './features/auth/authSlice';
import GymListPage from './pages/gyms/GymListPage';
import MembershipPlansPage from './pages/memberships/MembershipPlansPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import FogetPasswordPage from './pages/auth/FogetPasswordPage';
import ProtectedRoute from './routes/ProtectedRoute';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import QrCheckinPage from './pages/checkin/QrCheckinPage';
import BookingsPage from './pages/bookings/BookingsPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import ScannerPage from './pages/checkin/ScannerPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/Spinner';
import GymDetaiPage from './pages/gyms/GymDetaiPage';



function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((s) => s.auth);

  // On app load, if a token is stored, verify it's still valid and hydrate the user.
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, token, user]);

  // Global handler for 401s raised by the axios interceptor (expired/invalid token).
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
      navigate('/login');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch, navigate]);


  return (

    <div className="min-h-screen bg-surface font-body text-ink">
      <Navbar />

      <main>
        <Suspense fallback={<Spinner full />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<GymListPage />} />
            <Route path="/gyms" element={<GymListPage />} />
            <Route path="/gyms/:id" element={<GymDetaiPage />} />
            <Route path="/memberships/:gymId" element={<MembershipPlansPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<FogetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Regular user */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['user']}>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkin"
              element={
                <ProtectedRoute roles={['user']}>
                  <QrCheckinPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute roles={['user']}>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />

            {/* Gym owner */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <OwnerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/scan"
              element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <ScannerPage />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>

  )
}

export default App
