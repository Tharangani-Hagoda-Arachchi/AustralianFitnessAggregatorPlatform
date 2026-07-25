import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { clearAuthError, registerUser } from '../../features/auth/authSlice';
import Alert from '../../components/Alert';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error, isAuthenticated, user } = useAppSelector((s) => s.auth);

    useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            const roleHome = { admin: '/admin', owner: '/owner', user: '/dashboard' }[user.role];
            navigate(roleHome, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(form));
    };
    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
            <h1 className="mb-1 font-display text-2xl font-semibold">Create your account</h1>
            <p className="mb-6 text-sm text-ink/60">Join to find gyms, book classes, and track visits.</p>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="label" htmlFor="name">Full name</label>
                    <input
                        id="name"
                        required
                        minLength={2}
                        className="input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
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
                        minLength={8}
                        className="input"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-ink/40">At least 8 characters, including a number.</p>
                </div>

                <div>
                    <label className="label">I am signing up as</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['user', 'owner'].map((r) => (
                            <button
                                type="button"
                                key={r}
                                onClick={() => setForm({ ...form, role: r })}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${form.role === r
                                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                                    : 'border-ink/15 text-ink/60 hover:border-ink/30'
                                    }`}
                            >
                                {r === 'user' ? 'A member' : 'A gym owner'}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={status === 'loading'} className="btn-primary mt-2 w-full">
                    {status === 'loading' ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}

export default RegisterPage