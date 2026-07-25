import { useEffect, useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';



import { useAppDispatch, useAppSelector } from '../../app/hook.js';
import Spinner from '../../components/Spinner.jsx';
import Alert from '../../components/Alert.jsx';
import { approveGym, fetchAllGyms, fetchAllPayments, fetchAllUsers, fetchOverview, rejectGym, updateUserStatus, } from '../../features/admin/adminSclice.js';
import useChartColors from '../../hooks/useChartColor.js';

const TABS = ['Overview', 'Users', 'Gyms', 'Payments'];

function StatCard({ label, value }) {
    return (
        <div className="card">
            <p className="label">{label}</p>
            <p className="font-display text-2xl font-semibold text-ink">{value}</p>
        </div>
    );
}

function statusCounts(items, key) {
    const counts = {};
    for (const item of items) {
        const v = item[key];
        counts[v] = (counts[v] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
const AdminDashboardPage = () => {
    const [tab, setTab] = useState('Overview');
    const dispatch = useAppDispatch();
    const { overview, users, gyms, payments, error } = useAppSelector((s) => s.admin);
    const colors = useChartColors();

    useEffect(() => {
        dispatch(fetchOverview());
    }, [dispatch]);

    useEffect(() => {
        if (tab === 'Users') dispatch(fetchAllUsers());
        if (tab === 'Gyms') dispatch(fetchAllGyms());
        if (tab === 'Payments') dispatch(fetchAllPayments());
    }, [dispatch, tab]);

    const overviewChartData = useMemo(() => {
        if (!overview) return [];
        return [
            { name: 'Users', value: overview.totalUsers },
            { name: 'Gyms', value: overview.totalGyms },
            { name: 'Memberships', value: overview.activeMemberships },
            { name: 'Check-ins', value: overview.totalCheckins },
        ];
    }, [overview]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h1 className="mb-1 font-display text-2xl font-semibold">Admin dashboard</h1>
            <p className="mb-6 text-sm text-ink/60">Platform-wide management and reports.</p>

            {error && (
                <div className="mb-4">
                    <Alert type="error">{error}</Alert>
                </div>
            )}

            <div className="mb-6 flex gap-1 overflow-x-auto border-b border-ink/10">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`shrink-0 px-4 py-2.5 text-sm font-semibold transition ${tab === t
                            ? 'border-b-2 border-brand-500 text-brand-700'
                            : 'text-ink/50 hover:text-ink'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'Overview' &&
                (!overview ? (
                    <Spinner full />
                ) : (
                    <>
                        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <StatCard label="Total users" value={overview.totalUsers} />
                            <StatCard label="Approved gyms" value={overview.totalGyms} />
                            <StatCard label="Active memberships" value={overview.activeMemberships} />
                            <StatCard label="Total revenue" value={`$${overview.totalRevenue.toLocaleString()}`} />
                            <StatCard label="Total check-ins" value={overview.totalCheckins} />
                            <StatCard label="Gyms pending approval" value={overview.gymsPendingApproval} />
                        </div>

                        <section>
                            <h2 className="mb-3 font-display text-lg font-semibold">Platform activity</h2>
                            <div className="card">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={overviewChartData} margin={{ left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                        <XAxis dataKey="name" stroke={colors.text} fontSize={12} />
                                        <YAxis allowDecimals={false} stroke={colors.text} fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.grid}`, borderRadius: 8, fontSize: 12 }}
                                        />
                                        <Bar dataKey="value" fill={colors.brand} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </>
                ))}

            {tab === 'Users' && (
                <div className="card p-0! overflow-x-auto">
                    <table className="w-full min-w-140 text-sm">
                        <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                            <tr>
                                <th className="px-4 py-2.5">Name</th>
                                <th className="px-4 py-2.5">Email</th>
                                <th className="px-4 py-2.5">Role</th>
                                <th className="px-4 py-2.5">Status</th>
                                <th className="px-4 py-2.5" />
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t border-ink/5">
                                    <td className="px-4 py-2.5">{u.name}</td>
                                    <td className="px-4 py-2.5 text-ink/60">{u.email}</td>
                                    <td className="px-4 py-2.5 capitalize text-ink/60">{u.role}</td>
                                    <td className="px-4 py-2.5">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.isActive ? 'bg-brand-50 text-brand-700' : 'bg-clay-400/10 text-clay-500'
                                                }`}
                                        >
                                            {u.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button
                                            className="btn-secondary px-3! py-1! text-xs"
                                            onClick={() =>
                                                dispatch(updateUserStatus({ userId: u._id, isActive: !u.isActive }))
                                            }
                                        >
                                            {u.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'Gyms' && (
                <>
                    {gymStatusData.length > 0 && (
                        <div className="card mb-6">
                            <h2 className="mb-2 font-display text-sm font-semibold">Gyms by status</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={gymStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={2}
                                    >
                                        {gymStatusData.map((entry, i) => (
                                            <Cell key={entry.name} fill={colors.palette[i % colors.palette.length]} />
                                        ))}
                                    </Pie>
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.grid}`, borderRadius: 8, fontSize: 12 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {gyms.map((g) => (
                            <div key={g._id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-display text-sm font-semibold">{g.name}</p>
                                    <p className="text-xs text-ink/60">
                                        Owner: {g.owner?.name} · {g.owner?.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${g.status === 'approved'
                                            ? 'bg-brand-50 text-brand-700'
                                            : g.status === 'pending'
                                                ? 'bg-clay-400/10 text-clay-500'
                                                : 'bg-ink/5 text-ink/60'
                                            }`}
                                    >
                                        {g.status}
                                    </span>
                                    {g.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn-primary px-3! py-1! text-xs"
                                                onClick={() => dispatch(approveGym(g._id))}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-danger px-3! py-1! text-xs"
                                                onClick={() => dispatch(rejectGym(g._id))}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tab === 'Payments' && (
                <>
                    {paymentStatusData.length > 0 && (
                        <div className="card mb-6">
                            <h2 className="mb-2 font-display text-sm font-semibold">Payments by status</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={paymentStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={2}
                                    >
                                        {paymentStatusData.map((entry, i) => (
                                            <Cell key={entry.name} fill={colors.palette[i % colors.palette.length]} />
                                        ))}
                                    </Pie>
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.grid}`, borderRadius: 8, fontSize: 12 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="card p-0! overflow-x-auto">
                        <table className="w-full min-w-140text-sm">
                            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                                <tr>
                                    <th className="px-4 py-2.5">User</th>
                                    <th className="px-4 py-2.5">Gym</th>
                                    <th className="px-4 py-2.5">Amount</th>
                                    <th className="px-4 py-2.5">Status</th>
                                    <th className="px-4 py-2.5">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p._id} className="border-t border-ink/5">
                                        <td className="px-4 py-2.5">{p.user?.name}</td>
                                        <td className="px-4 py-2.5 text-ink/60">{p.gym?.name}</td>
                                        <td className="px-4 py-2.5">
                                            {p.currency} ${p.amount}
                                        </td>
                                        <td className="px-4 py-2.5 capitalize text-ink/60">{p.status}</td>
                                        <td className="px-4 py-2.5 text-ink/60">
                                            {new Date(p.createdAt).toLocaleDateString('en-AU')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminDashboardPage