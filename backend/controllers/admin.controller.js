import mongoose from "mongoose";
import { Checkin } from "../models/checkin.model.js";
import { Gym } from "../models/gym.model.js";
import { Membership } from "../models/membership.model.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/use.model.js";

// Get all users 
export const getAllUsers = async (req, res, next) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;

        // Filter users by role if role is provided
        const filter = {};
        if (role) {
            filter.role = role;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Fetch users and total count
        const [users, total] = await Promise.all([
            User.find(filter)
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 }),

            // Count total users
            User.countDocuments(filter)

        ]);

        // Send response
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            count: users.length,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get all gyms (
export const getAllGyms = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        // Filter gyms by status
        const filter = {};
        if (status) {
            filter.status = status;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Fetch gyms and total count
        const [gyms, total] = await Promise.all([
            Gym.find(filter)
                .populate("owner", "name email")
                .skip(skip)
                .limit(Number(limit)),
            // Count total gyms
            Gym.countDocuments(filter)

        ]);

        res.status(200).json({
            success: true,
            message: "Gyms fetched successfully",
            count: gyms.length,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            gyms
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update user status to active
export const updateUserStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;

        // Update user active status
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                isActive
            },
            {
                new: true
            }
        );

        // Check user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            user
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Approve gym 
export const approveGym = async (req, res, next) => {
    try {

        const { id } = req.params;

        // Update gym status to approved
        const gym = await Gym.findByIdAndUpdate(
            id,
            {
                status: "approved"
            },
            {
                new: true
            }
        );

        // Check gym exists
        if (!gym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Gym approved successfully",
            gym
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Reject gym 
export const rejectGym = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Update gym status to rejected
        const gym = await Gym.findByIdAndUpdate(
            id,
            {
                status: "rejected"
            },
            {
                new: true
            }
        );

        // Check gym exists
        if (!gym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Gym rejected successfully",
            gym
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get all payments details
export const getAllPayments = async (req, res, next) => {
    try {

        const { status, page = 1, limit = 20 } = req.query;

        // Filter payments by status
        const filter = {};
        if (status) {
            filter.status = status;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Fetch payments and total count
        const [payments, total] = await Promise.all([

            Payment.find(filter)
                .populate("user", "name email")
                .populate("gym", "name")
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 }),


            Payment.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            count: payments.length,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            payments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get platform overview (Admin dashboard)
export const getPlatformOverview = async (req, res, next) => {
    try {

        // Get platform statistics
        const [
            userCount,
            gymCount,
            activeMemberships,
            revenueAgg,
            checkinCount,
            pendingGyms

        ] = await Promise.all([


            // Total normal users
            User.countDocuments({
                role: "user"
            }),


            // Approved gyms
            Gym.countDocuments({
                status: "approved"
            }),


            // Active memberships
            Membership.countDocuments({
                status: "active"
            }),


            // Total successful revenue
            Payment.aggregate([
                {
                    $match: {
                        status: "succeeded"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]),


            // Total check-ins
            Checkin.countDocuments(),


            // Pending gym approvals
            Gym.countDocuments({
                status: "pending"
            })

        ]);

        res.status(200).json({
            success: true,
            message: "Platform overview fetched successfully",
            overview: {

                totalUsers: userCount,

                totalGyms: gymCount,

                activeMemberships,

                totalRevenue:
                    revenueAgg[0]?.total || 0,

                totalCheckins: checkinCount,

                gymsPendingApproval: pendingGyms
            }
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};