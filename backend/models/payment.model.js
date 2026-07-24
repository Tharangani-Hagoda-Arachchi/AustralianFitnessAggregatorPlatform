import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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
        membership: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Membership',
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'AUD',
        },
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed', 'refunded'],
            default: 'pending',
        },
        provider: {
            type: String, // e.g. 'stripe'
            default: 'stripe',
        },
        providerTransactionId: {
            type: String, // id returned by the payment gateway
        },
        type: {
            type: String,
            enum: ['subscription', 'renewal', 'upgrade', 'one_off'],
            default: 'subscription',
        },
    },
    { timestamps: true }
);

paymentSchema.index({ gym: 1, status: 1, createdAt: -1 }); 
paymentSchema.index({ user: 1, createdAt: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);