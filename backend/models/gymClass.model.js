import mongoose from "mongoose";

const gymClassSchema = new mongoose.Schema(
    {
        gym: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        instructor: {
            type: String,
            trim: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        bookedCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['scheduled', 'cancelled', 'completed'],
            default: 'scheduled',
        },
    },
    { timestamps: true }
);

// Virtual: is this class full?
gymClassSchema.virtual('isFull').get(function () {
    return this.bookedCount >= this.capacity;
});

gymClassSchema.set('toJSON', { virtuals: true });
gymClassSchema.index({ gym: 1, startTime: 1 });

export const GymClass = mongoose.model("GymClass", gymClassSchema);
