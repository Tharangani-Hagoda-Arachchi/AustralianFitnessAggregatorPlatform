import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gym: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym',
            required: true,
        },
        checkinDate: {
            type: String,
            required: true,
        },
        checkedInAt: {
            type: Date,
            default: Date.now,
        },
        method: {
            type: String,
            enum: ['qr', 'manual', 'geofence'],
            default: 'qr',
        },
        qrTokenId: {
            type: String, // reference id of the QR token that was validated,
        },
    },
    { timestamps: true }
);

checkinSchema.index({ user: 1, checkinDate: 1 });
checkinSchema.index({ gym: 1, checkinDate: 1 });

export const Checkin = mongoose.model("Checkin", checkinSchema);

