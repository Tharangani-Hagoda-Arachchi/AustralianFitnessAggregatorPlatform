import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { clearAuthError, resetPassword } from '../../features/auth/authSlice';
import Alert from '../../components/Alert';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error, isAuthenticated } = useAppSelector((s) => s.auth);

    useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

    useEffect(() => {
        if (isAuthenticated && status === 'succeeded') {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, status, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirm) return;
        dispatch(resetPassword({ token, password }));
    };

    if (!token) {
        return (
            <div className="mx-auto max-w-md px-4 py-12 text-center">
                <Alert type="error">
                    This reset link is missing its token. Please request a new one.
                </Alert>
                <Link to="/forgot-password" className="btn-primary mt-4 inline-flex">
                    Request new link
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
            <h1 className="mb-1 font-display text-2xl font-semibold">Choose a new password</h1>
            <p className="mb-6 text-sm text-ink/60">This link expires 15 minutes after it was requested.</p>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
            {password && confirm && password !== confirm && (
                <div className="mb-4"><Alert type="error">Passwords don't match</Alert></div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="label" htmlFor="password">New password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        minLength={8}
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="label" htmlFor="confirm">Confirm password</label>
                    <input
                        id="confirm"
                        type="password"
                        required
                        minLength={8}
                        className="input"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading' || password !== confirm}
                    className="btn-primary w-full"
                >
                    {status === 'loading' ? 'Resetting…' : 'Reset password'}
                </button>
            </form>
        </div>
    )
}

export default ResetPasswordPage