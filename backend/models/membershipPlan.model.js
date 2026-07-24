import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, //  'Basic', 'Premium', 'All-Access'
        },
        gym: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym',
            required: true,
        },
        description: {
            type: String,
            maxlength: 500,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        billingCycle: {
            type: String,
            enum: ['monthly', 'quarterly', 'yearly'],
            default: 'monthly',
        },
        perks: [String], // ['Unlimited classes', 'Guest passes']
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

membershipPlanSchema.index({ gym: 1, isActive: 1 });

export const MembershipPlan = mongoose.model("MembershipPlan", membershipPlanSchema);