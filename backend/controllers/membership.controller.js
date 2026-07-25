import { Membership } from "../models/membership.model.js";
import { MembershipPlan } from "../models/membershipPlan.model.js";
import { Payment } from "../models/payment.model.js";

function addBillingCycle(date, cycle) {
    const d = new Date(date);
    if (cycle === 'monthly') d.setMonth(d.getMonth() + 1);
    if (cycle === 'quarterly') d.setMonth(d.getMonth() + 3);
    if (cycle === 'yearly') d.setFullYear(d.getFullYear() + 1);
    return d;
}
// Get membership plans for a gym
export const getPlansForGym = async (req, res, next) => {
    try {

        const { gymId } = req.params;

        if (!gymId) {
            return res.status(400).json({
                message: "Gym Id required"
            });

        }

        // Get active membership plans for the gym
        const plans = await MembershipPlan.find({
            gym: gymId,
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: "Membership plans fetched successfully",
            count: plans.length,
            plans
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Create membership plan
export const createPlan = async (req, res, next) => {
    try {
        // Create membership plan
        const plan = new MembershipPlan(req.body);

        await plan.save();

        res.status(201).json({
            success: true,
            message: "Membership plan created successfully",
            plan
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get logged-in user's active membership
export const getMyMembership = async (req, res, next) => {
    try {

        // Find active membership of logged-in user
        const membership = await Membership.findOne({
            user: req.user._id,
            status: "active"
        })
            .populate("gym", "name")
            .populate("plan", "name price billingCycle perks");


        // Send response
        res.status(200).json({
            success: true,
            message: "Membership fetched successfully",
            membership: membership || null
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Subscribe to a membership plan
export const subscribe = async (req, res, next) => {
    try {

        const { planId } = req.body;

        // Find membership plan
        const plan = await MembershipPlan.findById(planId);

        if (!plan || !plan.isActive) {
            return res.status(404).json({
                success: false,
                message: "Plan not found or inactive"
            });
        }

        // Check existing active membership
        const existingMembership = await Membership.findOne({
            user: req.user._id,
            gym: plan.gym,
            status: "active"
        });

        if (existingMembership) {
            return res.status(409).json({
                success: false,
                message: "You already have an active membership at this gym."
            });
        }

        // Create payment
        const payment = await Payment.create({
            user: req.user._id,
            gym: plan.gym,
            amount: plan.price,
            status: "succeeded",
            type: "subscription"
        });

        // Create membership
        const membership = await Membership.create({
            user: req.user._id,
            gym: plan.gym,
            plan: plan._id,
            status: "active",
            startDate: new Date(),
            renewalDate: addBillingCycle(
                new Date(),
                plan.billingCycle
            ),
            history: [
                {
                    action: "subscribed",
                    toPlan: plan._id
                }
            ]
        });

        // Link payment with membership
        payment.membership = membership._id;
        await payment.save();

        res.status(201).json({
            success: true,
            message: "Membership subscribed successfully",
            membership,
            payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Change membership plan
export const changePlan = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { newPlanId } = req.body;

        // Find membership
        const membership = await Membership.findOne({
            _id: id,
            user: req.user._id
        });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found"
            });
        }

        // Check membership is active
        if (membership.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Membership is not active"
            });
        }

        // Find new plan
        const newPlan = await MembershipPlan.findById(newPlanId);

        if (!newPlan || !newPlan.isActive) {
            return res.status(404).json({
                success: false,
                message: "New plan not found or inactive"
            });
        }

        // Check new plan belongs to the same gym
        if (String(newPlan.gym) !== String(membership.gym)) {
            return res.status(400).json({
                success: false,
                message: "Cannot switch to a plan from a different gym"
            });
        }

        // Find current plan
        const oldPlan = await MembershipPlan.findById(membership.plan);

        // Decide whether upgrade or downgrade
        const action =
            newPlan.price > oldPlan.price
                ? "upgraded"
                : "downgraded";

        // Update membership
        membership.plan = newPlan._id;

        membership.history.push({
            action,
            fromPlan: oldPlan._id,
            toPlan: newPlan._id
        });

        await membership.save();

        // Send response
        res.status(200).json({
            success: true,
            message: `Membership ${action} successfully`,
            membership
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Cancel membership
export const cancelMembership = async (req, res, next) => {
    try {

        const { id } = req.params;

        // Find membership
        const membership = await Membership.findOne({
            _id: id,
            user: req.user._id
        });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found"
            });
        }

        // Check membership is active
        if (membership.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Membership is not active"
            });
        }

        // Cancel membership
        membership.status = "cancelled";
        membership.cancelledAt = new Date();
        membership.autoRenew = false;

        membership.history.push({
            action: "cancelled"
        });

        await membership.save();

        res.status(200).json({
            success: true,
            message: "Membership cancelled successfully",
            membership
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};