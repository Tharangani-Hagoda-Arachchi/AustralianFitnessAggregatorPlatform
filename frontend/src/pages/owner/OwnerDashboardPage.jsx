import { useEffect, useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import useChartColors from '../../hooks/useChartColor';
import { fetchGymAnalytics, fetchMyGyms } from '../../features/owner/ownerSlice';

function StatCard({ label, value }) {
    return (
        <div className="card">
            <p className="label">{label}</p>
            <p className="font-display text-2xl font-semibold text-ink">{value}</p>
        </div>
    );
}

const OwnerDashboardPage = () => {
    const [selectedGymId, setSelectedGymId] = useState('');
    const dispatch = useAppDispatch();
    const { myGyms, analytics, status, analyticsStatus, error } = useAppSelector((s) => s.owner);
    const colors = useChartColors();

    useEffect(() => {
        dispatch(fetchMyGyms());
    }, [dispatch]);

    useEffect(() => {
        if (myGyms.length > 0 && !selectedGymId) {
            setSelectedGymId(myGyms[0]._id);
        }
    }, [myGyms, selectedGymId]);

    useEffect(() => {
        if (selectedGymId) {
            dispatch(fetchGymAnalytics({ gymId: selectedGymId }));
        }
    }, [dispatch, selectedGymId]);

    // Aggregate the recent check-ins list into a per-day count for a trend chart —
    // the backend returns raw check-in records, so this shaping happens client-side.
    const checkinsByDay = useMemo(() => {
        if (!analytics?.recentCheckins) return [];
        const counts = {};
        for (const c of analytics.recentCheckins) {
            const day = new Date(c.checkedInAt).toLocaleDateString('en-AU', {
                weekday: 'short',
                day: 'numeric',
            });
            counts[day] = (counts[day] || 0) + 1;
        }
        return Object.entries(counts).map(([day, count]) => ({ day, count }));
    }, [analytics]);

    const capacityChartData = useMemo(
        () =>
            (analytics?.capacityBreakdown || []).map((c) => ({
                name: c.name.length > 14 ? c.name.slice(0, 13) + '…' : c.name,
                utilisationPct: c.utilisationPct,
                full: c.utilisationPct >= 100,
            })),
        [analytics]
    );

    if (status === 'loading' && myGyms.length === 0) return <Spinner full />;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h1 className="mb-1 font-display text-2xl font-semibold">Owner dashboard</h1>
                    <p className="text-sm text-ink/60">Check-ins, revenue, and capacity for your gyms.</p>
                </div>
                {myGyms.length > 0 && (
                    <select
                        className="input sm:max-w-[240px]"
                        value={selectedGymId}
                        onChange={(e) => setSelectedGymId(e.target.value)}
                    >
                        {myGyms.map((g) => (
                            <option key={g._id} value={g._id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {error && (
                <div className="mb-4">
                    <Alert type="error">{error}</Alert>
                </div>
            )}

            {myGyms.length === 0 ? (
                <p className="text-sm text-ink/50">
                    You don't have any gyms yet. Add a gym listing to see analytics here.
                </p>
            ) : analyticsStatus === 'loading' || !analytics ? (
                <Spinner full />
            ) : (
                <>
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard label="Total check-ins" value={analytics.totalCheckins} />
                        <StatCard label="Total revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} />
                        <StatCard label="Active bookings" value={analytics.activeBookings} />
                        <StatCard label="Transactions" value={analytics.totalTransactions} />
                    </div>

                    <section className="mb-8">
                        <h2 className="mb-3 font-display text-lg font-semibold">Upcoming class capacity</h2>
                        {capacityChartData.length === 0 ? (
                            <p className="text-sm text-ink/50">No upcoming classes scheduled.</p>
                        ) : (
                            <div className="card">
                                <ResponsiveContainer width="100%" height={Math.max(180, capacityChartData.length * 44)}>
                                    <BarChart data={capacityChartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                                        <XAxis
                                            type="number"
                                            domain={[0, 100]}
                                            tickFormatter={(v) => `${v}%`}
                                            stroke={colors.text}
                                            fontSize={12}
                                        />
                                        <YAxis type="category" dataKey="name" width={110} stroke={colors.text} fontSize={12} />
                                        <Tooltip
                                            formatter={(v) => [`${v}%`, 'Utilisation']}
                                            contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.grid}`, borderRadius: 8, fontSize: 12 }}
                                        />
                                        <Bar dataKey="utilisationPct" radius={[0, 6, 6, 0]}>
                                            {capacityChartData.map((entry, i) => (
                                                <Cell key={i} fill={entry.full ? colors.clay : colors.brand} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </section>

                    {checkinsByDay.length > 0 && (
                        <section className="mb-8">
                            <h2 className="mb-3 font-display text-lg font-semibold">Check-ins by day</h2>
                            <div className="card">
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={checkinsByDay} margin={{ left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                        <XAxis dataKey="day" stroke={colors.text} fontSize={12} />
                                        <YAxis allowDecimals={false} stroke={colors.text} fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.grid}`, borderRadius: 8, fontSize: 12 }}
                                        />
                                        <Bar dataKey="count" fill={colors.brand} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="mb-3 font-display text-lg font-semibold">Recent check-ins</h2>
                        {analytics.recentCheckins.length === 0 ? (
                            <p className="text-sm text-ink/50">No check-ins recorded yet.</p>
                        ) : (
                            <div className="card !p-0 overflow-x-auto">
                                <table className="w-full min-w-[360px] text-sm">
                                    <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                                        <tr>
                                            <th className="px-4 py-2.5">Member</th>
                                            <th className="px-4 py-2.5">Checked in</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.recentCheckins.map((c) => (
                                            <tr key={c._id} className="border-t border-ink/5">
                                                <td className="px-4 py-2.5">{c.user?.name}</td>
                                                <td className="px-4 py-2.5 text-ink/60">
                                                    {new Date(c.checkedInAt).toLocaleString('en-AU')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    )
}

export default OwnerDashboardPage