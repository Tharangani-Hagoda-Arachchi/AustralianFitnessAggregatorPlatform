import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gymClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GymClass',
            required: true,
        },
        gym: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym',
            required: true,
        },
        status: {
            type: String,
            enum: ['booked', 'cancelled', 'attended', 'no_show'],
            default: 'booked',
        },
        bookedAt: {
            type: Date,
            default: Date.now,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

bookingSchema.index(
    { user: 1, gymClass: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'booked' } }
);

export const Booking = mongoose.model("Booking", bookingSchema);