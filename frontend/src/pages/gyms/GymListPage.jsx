import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook.js';
import Spinner from '../../components/Spinner';
import { searchGyms } from '../../features/gyms/gymSlice.js';
import Alert from '../../components/Alert.jsx';
import GymCard from '../../components/GymCard.jsx';

const FACILITIES = ['Pool', 'Sauna', 'Free weights', 'Group classes', '24/7 access', 'Creche'];

const GymListPage = () => {
    const [q, setQ] = useState('');
    const [facility, setFacility] = useState('');
    const [page, setPage] = useState(1);
    const dispatch = useAppDispatch();
    const { results, status, error, totalPages } = useAppSelector((s) => s.gyms);


    useEffect(() => {
        dispatch(searchGyms({ q: q || undefined, facility: facility || undefined, page, limit: 12 }));
    }, [dispatch, q, facility, page]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h1 className="mb-1 font-display text-2xl font-semibold">Find a gym</h1>
            <p className="mb-6 text-sm text-ink/60">Search and filter gyms across Australia.</p>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                    className="input sm:max-w-xs"
                    placeholder="Search by name or suburb…"
                    value={q}
                    onChange={(e) => {
                        setPage(1);
                        setQ(e.target.value);
                    }}
                />
                <select
                    className="input m:max-w-50"
                    value={facility}
                    onChange={(e) => {
                        setPage(1);
                        setFacility(e.target.value);
                    }}
                >
                    <option value="">All facilities</option>
                    {FACILITIES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

            {status === 'loading' ? (
                <Spinner full />
            ) : results.length === 0 ? (
                <p className="py-12 text-center text-sm text-ink/50">No gyms match your search yet.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {results.map((gym) => (
                            <GymCard key={gym._id} gym={gym} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                className="btn-secondary px-4! py-1.5!"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </button>
                            <span className="text-sm text-ink/60">Page {page} of {totalPages}</span>
                            <button
                                className="btn-secondary px-4! py-1.5!"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default GymListPage