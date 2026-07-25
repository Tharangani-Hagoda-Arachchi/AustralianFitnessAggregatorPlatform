import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { fetchUserDashboard } from '../../features/dashboard/dashboardSlice';

const UserDashboardPage = () => {
    const dispatch = useAppDispatch();
    const { data, status, error } = useAppSelector((s) => s.dashboard);
    const { user } = useAppSelector((s) => s.auth);

    useEffect(() => {
        dispatch(fetchUserDashboard());
    }, [dispatch]);

    if (status === 'loading' || !data) return <Spinner full />;
    if (error) return <div className="mx-auto max-w-3xl px-4 py-8"><Alert type="error">{error}</Alert></div>;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <h1 className="mb-1 font-display text-2xl font-semibold">Hi {user?.name?.split(' ')[0]} 👋</h1>
            <p className="mb-6 text-sm text-ink/60">Here's what's happening with your training.</p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* Membership */}
                <div className="card sm:col-span-2">
                    <h2 className="mb-3 font-display text-base font-semibold">Membership</h2>
                    {data.membership ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{data.membership.gym?.name}</p>
                                <p className="text-sm text-ink/60">{data.membership.plan?.name} plan</p>
                            </div>
                            <p className="text-xs text-ink/50">
                                Renews {new Date(data.membership.renewalDate).toLocaleDateString('en-AU')}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-ink/50">
                            No active membership yet.{' '}
                            <Link to="/gyms" className="font-medium text-brand-600 hover:underline">Browse gyms</Link>
                        </p>
                    )}
                </div>

                {/* Visits */}
                <div className="card flex flex-col items-center justify-center text-center">
                    <p className="font-display text-3xl font-semibold text-brand-600">{data.totalVisits}</p>
                    <p className="text-xs text-ink/50">total visits</p>
                </div>

                {/* Favourite gym */}
                <div className="card">
                    <h2 className="mb-3 font-display text-base font-semibold">Favourite gym</h2>
                    {data.favouriteGym ? (
                        <Link to={`/gyms/${data.favouriteGym._id}`} className="text-sm font-medium text-brand-600 hover:underline">
                            {data.favouriteGym.name}
                        </Link>
                    ) : (
                        <p className="text-sm text-ink/50">No favourite gym set yet.</p>
                    )}
                </div>

                {/* Upcoming classes */}
                <div className="card sm:col-span-2">
                    <h2 className="mb-3 font-display text-base font-semibold">Upcoming classes</h2>
                    {data.upcomingClasses?.length > 0 ? (
                        <ul className="divide-y divide-ink/5">
                            {data.upcomingClasses.map((b) => (
                                <li key={b._id} className="flex items-center justify-between py-2 text-sm">
                                    <span>{b.gymClass?.name} · {b.gym?.name}</span>
                                    <span className="text-ink/50">
                                        {new Date(b.gymClass?.startTime).toLocaleString('en-AU', {
                                            weekday: 'short', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-ink/50">
                            No upcoming classes.{' '}
                            <Link to="/gyms" className="font-medium text-brand-600 hover:underline">Find a class</Link>
                        </p>
                    )}
                </div>

                {/* Recent activity */}
                <div className="card sm:col-span-3">
                    <h2 className="mb-3 font-display text-base font-semibold">Recent activity</h2>
                    {data.recentActivity?.length > 0 ? (
                        <ul className="divide-y divide-ink/5">
                            {data.recentActivity.map((c) => (
                                <li key={c._id} className="flex items-center justify-between py-2 text-sm">
                                    <span>Checked in at {c.gym?.name}</span>
                                    <span className="text-ink/50">
                                        {new Date(c.checkedInAt).toLocaleString('en-AU', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-ink/50">No check-ins yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDashboardPage