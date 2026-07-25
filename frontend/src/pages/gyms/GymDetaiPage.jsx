import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook.js';
import { clearCurrentGym, fetchGymById, toggleFavouriteGym, } from '../../features/gyms/gymSlice.js';
import Alert from '../../components/Alert.jsx';
import Spinner from '../../components/Spinner.jsx';
import GymMap from '../../components/GymMap.jsx';

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const GymDetaiPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { current: gym, detailStatus, error } = useAppSelector((s) => s.gyms);
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);

    useEffect(() => {
        dispatch(fetchGymById(id));
        return () => dispatch(clearCurrentGym());
    }, [dispatch, id]);

    if (detailStatus === 'loading' || !gym) return <Spinner full />;
    if (error) return <div className="mx-auto max-w-3xl px-4 py-8"><Alert type="error">{error}</Alert></div>;

    const isFavourite = isAuthenticated && String(user?.favouriteGym) === String(gym._id);
    const mapsUrl = gym.location?.coordinates
        ? `https://www.google.com/maps/dir/?api=1&destination=${gym.location.coordinates[1]},${gym.location.coordinates[0]}`
        : null;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            {/* Gallery */}
            <div className="mb-6 grid grid-cols-2 gap-2 overflow-hidden rounded-xl2 sm:grid-cols-4">
                {(gym.images?.length ? gym.images : [{ url: null }]).slice(0, 4).map((img, i) => (
                    <div
                        key={i}
                        className={`bg-brand-100 ${i === 0 ? 'col-span-2 h-52 sm:row-span-2 sm:h-full' : 'h-24 sm:h-28'}`}
                    >
                        {img.url ? (
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-brand-500">
                                <span className="font-display text-3xl">{gym.name?.[0]}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-semibold">{gym.name}</h1>
                    <p className="mt-1 text-sm text-ink/60">
                        {[gym.address?.street, gym.address?.suburb, gym.address?.state, gym.address?.postcode]
                            .filter(Boolean)
                            .join(', ')}
                    </p>
                </div>
                {isAuthenticated && user?.role === 'user' && (
                    <button
                        onClick={() => dispatch(toggleFavouriteGym(gym._id))}
                        className={isFavourite ? 'btn-primary px-4! py-1.5!' : 'btn-secondary px-4! py-1.5!'}
                    >
                        {isFavourite ? '★ Favourited' : '☆ Favourite'}
                    </button>
                )}
            </div>

            {gym.description && <p className="mt-4 text-sm leading-relaxed text-ink/70">{gym.description}</p>}

            {/* Action row */}
            <div className="mt-6 flex flex-wrap gap-3">
                <Link to={`/memberships/${gym._id}`} className="btn-primary">View membership plans</Link>
                {isAuthenticated && user?.role === 'user' && (
                    <>
                        <Link to={`/checkin?gymId=${gym._id}`} className="btn-secondary">Check in here</Link>
                        <Link to={`/bookings?gymId=${gym._id}`} className="btn-secondary">Book a class</Link>
                    </>
                )}
                {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-secondary">Get directions</a>
                )}
            </div>

            {/* Facilities */}
            {gym.facilities?.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-2 font-display text-lg font-semibold">Facilities</h2>
                    <div className="flex flex-wrap gap-2">
                        {gym.facilities.map((f) => (
                            <span key={f} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Timetable */}
            {gym.timetable?.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-3 font-display text-lg font-semibold">Opening hours</h2>
                    <div className="card divide-y divide-ink/5 p-0!">
                        {[...gym.timetable]
                            .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
                            .map((slot) => (
                                <div key={slot.day} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                    <span className="font-medium text-ink/70">{slot.day}</span>
                                    <span className="text-ink/60">{slot.open} – {slot.close}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Location */}
            {gym.location?.coordinates && (
                <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold">Location</h2>
                        {mapsUrl && (
                            <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-600 hover:underline">
                                Get directions →
                            </a>
                        )}
                    </div>
                    <GymMap
                        lat={gym.location.coordinates[1]}
                        lng={gym.location.coordinates[0]}
                        name={gym.name}
                    />
                </div>
            )}
        </div>
    )
}

export default GymDetaiPage