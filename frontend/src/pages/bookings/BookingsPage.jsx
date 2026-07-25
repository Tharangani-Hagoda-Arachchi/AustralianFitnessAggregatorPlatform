import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import { cancelBooking, clearBookingError, createBooking, fetchClassesForGym, fetchMyBookings } from '../../features/booking/bookingSlice';

function formatDateTime(iso) {
    return new Date(iso).toLocaleString('en-AU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const BookingsPage = () => {
    const [searchParams] = useSearchParams();
    const gymId = searchParams.get('gymId'); // arrive here from a gym detail page's "Book a class" link

    const dispatch = useAppDispatch();
    const { myBookings, classes, status, bookStatus, error } = useAppSelector((s) => s.bookings);

    useEffect(() => {
        dispatch(fetchMyBookings());
    }, [dispatch]);

    useEffect(() => {
        if (gymId) dispatch(fetchClassesForGym(gymId));
    }, [dispatch, gymId]);

    const handleBook = (classId) => {
        dispatch(clearBookingError());
        dispatch(createBooking(classId));
    };

    const handleCancel = (bookingId) => {
        dispatch(cancelBooking(bookingId));
    };

    const bookedClassIds = new Set(myBookings.map((b) => b.gymClass?._id || b.gymClass));
    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <h1 className="mb-1 font-display text-2xl font-semibold">My bookings</h1>
            <p className="mb-6 text-sm text-ink/60">Manage your upcoming classes.</p>

            {error && (
                <div className="mb-4">
                    <Alert type="error" onDismiss={() => dispatch(clearBookingError())}>
                        {error}
                    </Alert>
                </div>
            )}

            <section className="mb-10">
                <h2 className="mb-3 font-display text-lg font-semibold">Upcoming classes</h2>
                {myBookings.length === 0 ? (
                    <p className="text-sm text-ink/50">
                        You don't have any bookings yet. Visit a gym's page to book a class.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {myBookings.map((b) => (
                            <div key={b._id} className="card flex items-center justify-between">
                                <div>
                                    <p className="font-display text-sm font-semibold">{b.gymClass?.name}</p>
                                    <p className="text-xs text-ink/60">
                                        {b.gym?.name} · {b.gymClass?.startTime && formatDateTime(b.gymClass.startTime)}
                                    </p>
                                    {b.gymClass?.instructor && (
                                        <p className="text-xs text-ink/50">Instructor: {b.gymClass.instructor}</p>
                                    )}
                                </div>
                                <button className="btn-danger !px-4 !py-1.5" onClick={() => handleCancel(b._id)}>
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {gymId && (
                <section>
                    <h2 className="mb-3 font-display text-lg font-semibold">Available classes</h2>
                    {status === 'loading' ? (
                        <Spinner full />
                    ) : classes.length === 0 ? (
                        <p className="text-sm text-ink/50">No upcoming classes scheduled at this gym.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {classes.map((c) => {
                                const isFull = c.bookedCount >= c.capacity;
                                const alreadyBooked = bookedClassIds.has(c._id);
                                return (
                                    <div key={c._id} className="card flex items-center justify-between">
                                        <div>
                                            <p className="font-display text-sm font-semibold">{c.name}</p>
                                            <p className="text-xs text-ink/60">{formatDateTime(c.startTime)}</p>
                                            <p className="text-xs text-ink/50">
                                                {c.bookedCount}/{c.capacity} spots filled
                                            </p>
                                        </div>
                                        <button
                                            className="btn-primary !px-4 !py-1.5"
                                            disabled={isFull || alreadyBooked || bookStatus === 'loading'}
                                            onClick={() => handleBook(c._id)}
                                        >
                                            {alreadyBooked ? 'Booked' : isFull ? 'Full' : 'Book'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default BookingsPage