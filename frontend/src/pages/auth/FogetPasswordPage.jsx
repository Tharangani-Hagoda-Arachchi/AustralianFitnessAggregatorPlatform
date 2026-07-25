import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { clearAuthError, clearAuthMessage, forgotPassword } from '../../features/auth/authSlice';
import Alert from '../../components/Alert';

const FogetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const dispatch = useAppDispatch();
    const { status, error, message } = useAppSelector((s) => s.auth);

    useEffect(() => () => {
        dispatch(clearAuthError());
        dispatch(clearAuthMessage());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };
    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
            <h1 className="mb-1 font-display text-2xl font-semibold">Reset your password</h1>
            <p className="mb-6 text-sm text-ink/60">
                Enter the email on your account and we'll send you a reset link.
            </p>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
            {message && <div className="mb-4"><Alert type="success">{message}</Alert></div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                    {status === 'loading' ? 'Sending…' : 'Send reset link'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
                <Link to="/login" className="font-semibold text-brand-600 hover:underline">
                    Back to log in
                </Link>
            </p>
        </div>
    )
}

export default FogetPasswordPage