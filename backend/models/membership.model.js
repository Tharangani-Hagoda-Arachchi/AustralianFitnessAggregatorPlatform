import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
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
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MembershipPlan',
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired', 'pending_payment'],
            default: 'pending_payment',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        renewalDate: {
            type: Date,
            required: true,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
        autoRenew: {
            type: Boolean,
            default: true,
        },

        // Keep history of plan changes for the dashboard/audit trail
        history: [
            {
                action: {
                    type: String,
                    enum: ['subscribed', 'upgraded', 'downgraded', 'renewed', 'cancelled'],
                },
                fromPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
                toPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
                date: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// A user should only have one active membership per gym at a time
membershipSchema.index(
    { user: 1, gym: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
);


export const Membership = mongoose.model("Membership", membershipSchema);