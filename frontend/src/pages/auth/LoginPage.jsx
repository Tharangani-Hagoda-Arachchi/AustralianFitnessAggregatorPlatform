import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { clearAuthError, loginUser } from '../../features/auth/authSlice';

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { status, error, isAuthenticated, user } = useAppSelector((s) => s.auth);

    useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            const from = location.state?.from?.pathname;
            const roleHome = { admin: '/admin', owner: '/owner', user: '/dashboard' }[user.role];
            navigate(from || roleHome, { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };
    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
            <h1 className="mb-1 font-display text-2xl font-semibold">Welcome back</h1>
            <p className="mb-6 text-sm text-ink/60">Log in to book classes and check in to your gym.</p>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="input"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </div>

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button type="submit" disabled={status === 'loading'} className="btn-primary mt-2 w-full">
                    {status === 'loading' ? 'Logging in…' : 'Log in'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-brand-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}

export default LoginPage