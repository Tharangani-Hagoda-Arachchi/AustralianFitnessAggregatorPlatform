import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { searchGyms } from '../../features/gyms/gymSlice';
import { clearCheckinError, clearQrPass, generateQrPass } from '../../features/checkin/checkinSlice';

const QrCheckinPage = () => {
    const [searchParams] = useSearchParams();
    const preselectedGymId = searchParams.get('gymId') || '';
    const [gymId, setGymId] = useState(preselectedGymId);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const dispatch = useAppDispatch();
    const { results: gyms } = useAppSelector((s) => s.gyms);
    const { qrImage, qrExpiresAt, qrStatus, error, lastResult } = useAppSelector(
        (s) => s.checkin
    );

    useEffect(() => {
        dispatch(searchGyms({ limit: 50 }));
    }, [dispatch]);

    useEffect(() => () => dispatch(clearCheckinError()), [dispatch]);

    // Live 60-second countdown driven by the server-provided expiresAt
    useEffect(() => {
        if (!qrExpiresAt) return;
        const tick = () => {
            const diff = Math.max(0, Math.round((new Date(qrExpiresAt) - Date.now()) / 1000));
            setSecondsLeft(diff);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [qrExpiresAt]);

    const handleGenerate = useCallback(() => {
        if (!gymId) return;
        dispatch(clearQrPass());
        dispatch(generateQrPass(gymId));
    }, [dispatch, gymId]);

    // Auto-expire the QR image client-side once the countdown hits zero,
    // even though the backend already rejects an expired token independently.
    useEffect(() => {
        if (secondsLeft === 0 && qrImage) {
            dispatch(clearQrPass());
        }
    }, [secondsLeft, qrImage, dispatch]);

    return (
        <div className="mx-auto max-w-lg px-4 py-8">
            <h1 className="mb-1 font-display text-2xl font-semibold">Gym check-in</h1>
            <p className="mb-6 text-sm text-ink/60">
                Generate a QR pass and show it at the gym's scanner. Passes expire after 60 seconds.
            </p>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
            {lastResult && <div className="mb-4"><Alert type="success">{lastResult}</Alert></div>}

            <div className="card">
                <label className="label" htmlFor="gym">Select gym</label>
                <select
                    id="gym"
                    className="input mb-4"
                    value={gymId}
                    onChange={(e) => setGymId(e.target.value)}
                >
                    <option value="">Choose a gym…</option>
                    {gyms.map((g) => (
                        <option key={g._id} value={g._id}>{g.name}</option>
                    ))}
                </select>

                {!qrImage ? (
                    <button
                        onClick={handleGenerate}
                        disabled={!gymId || qrStatus === 'loading'}
                        className="btn-primary w-full"
                    >
                        {qrStatus === 'loading' ? 'Generating…' : 'Generate QR pass'}
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <img src={qrImage} alt="QR check-in pass" className="h-52 w-52 rounded-lg border border-ink/10" />
                        <div className="text-center">
                            <p className="font-display text-3xl font-semibold text-brand-600">{secondsLeft}s</p>
                            <p className="text-xs text-ink/50">until this pass expires</p>
                        </div>
                        <button onClick={handleGenerate} className="btn-secondary w-full">
                            Regenerate pass
                        </button>
                    </div>
                )}
            </div>

            <p className="mt-4 text-center text-xs text-ink/40">
                The gym's front-desk scanner reads this code and submits it to{' '}
                <code className="rounded bg-ink/5 px-1">POST /api/checkin</code> automatically.
            </p>
        </div>
    )
}

export default QrCheckinPage