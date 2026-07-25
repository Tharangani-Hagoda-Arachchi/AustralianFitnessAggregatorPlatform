import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { fetchMyGyms } from '../../features/owner/ownerSlice';
import { clearCheckinError, submitCheckIn } from '../../features/checkin/checkinSlice';
import QrScanner from '../../components/QrScanner';
import Alert from '../../components/Alert';

const ScannerPage = () => {
    const [gymId, setGymId] = useState('');
    const [qrToken, setQrToken] = useState('');
    const [mode, setMode] = useState('camera'); // 'camera' | 'manual'
    const dispatch = useAppDispatch();
    const { myGyms } = useAppSelector((s) => s.owner);
    const { checkinStatus, error, lastResult } = useAppSelector((s) => s.checkin);

    useEffect(() => {
        dispatch(fetchMyGyms());
        return () => dispatch(clearCheckinError());
    }, [dispatch]);

    const handleScan = useCallback(
        (decodedText) => {
            if (!gymId) return; // ignore scans until a gym is selected
            dispatch(submitCheckIn({ gymId, qrToken: decodedText }));
        },
        [dispatch, gymId]
    );

    const handleManualSubmit = (e) => {
        e.preventDefault();
        dispatch(submitCheckIn({ gymId, qrToken }));
        setQrToken('');
    };

    return (
        <div className="mx-auto max-w-lg px-4 py-8">
            <h1 className="mb-1 font-display text-2xl font-semibold">Front-desk scanner</h1>
            <p className="mb-6 text-sm text-ink/60">
                Scan a member's QR pass with your camera to record their check-in.
            </p>

            <div className="mb-4">
                <label className="label" htmlFor="gym">Gym</label>
                <select
                    id="gym"
                    className="input"
                    value={gymId}
                    onChange={(e) => setGymId(e.target.value)}
                >
                    <option value="">Select your gym…</option>
                    {myGyms.map((g) => (
                        <option key={g._id} value={g._id}>{g.name}</option>
                    ))}
                </select>
            </div>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
            {lastResult && <div className="mb-4"><Alert type="success">{lastResult}</Alert></div>}

            <div className="mb-4 flex gap-1 rounded-full border border-ink/10 bg-card p-1 text-sm font-semibold">
                <button
                    onClick={() => setMode('camera')}
                    className={`flex-1 rounded-full py-1.5 transition ${mode === 'camera' ? 'bg-brand-500 text-white' : 'text-ink/60'}`}
                >
                    Camera
                </button>
                <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 rounded-full py-1.5 transition ${mode === 'manual' ? 'bg-brand-500 text-white' : 'text-ink/60'}`}
                >
                    Manual entry
                </button>
            </div>

            {mode === 'camera' ? (
                <div className="card">
                    {!gymId ? (
                        <p className="text-center text-sm text-ink/50">Select a gym above to start scanning.</p>
                    ) : (
                        <QrScanner active={mode === 'camera'} onScan={handleScan} />
                    )}
                </div>
            ) : (
                <form onSubmit={handleManualSubmit} className="card flex flex-col gap-4">
                    <div>
                        <label className="label" htmlFor="token">Scanned QR token</label>
                        <textarea
                            id="token"
                            required
                            rows={3}
                            className="input font-mono text-xs"
                            placeholder="Paste the decoded QR token here"
                            value={qrToken}
                            onChange={(e) => setQrToken(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={checkinStatus === 'loading' || !gymId}
                        className="btn-primary w-full"
                    >
                        {checkinStatus === 'loading' ? 'Validating…' : 'Record check-in'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default ScannerPage