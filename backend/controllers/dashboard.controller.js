import { Booking } from "../models/bookings.model.js";
import { Checkin } from "../models/checkin.model.js";
import { Membership } from "../models/membership.model.js";
import { User } from "../models/use.model.js";

// Get logged-in user's dashboard
export const getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Fetch dashboard data
        const [
            membership,
            recentCheckins,
            upcomingBookings,
            checkinCount,
            user
        ] = await Promise.all([
            Membership.findOne({
                user: userId,
                status: "active"
            })
                .populate("gym", "name")
                .populate("plan", "name price billingCycle"),

            Checkin.find({
                user: userId
            })
                .populate("gym", "name")
                .sort({
                    checkedInAt: -1
                })
                .limit(10),

            Booking.find({
                user: userId,
                status: "booked"
            })
                .populate({
                    path: "gymClass",
                    select: "name startTime instructor"
                })
                .populate({
                    path: "gym",
                    select: "name"
                })
                .sort({
                    createdAt: -1
                })
                .limit(10),

            Checkin.countDocuments({
                user: userId
            }),

            User.findById(userId)
                .populate(
                    "favouriteGym",
                    "name address images"
                )
        ]);

        res.status(200).json({
            success: true,
            message: "Dashboard fetched successfully",
            dashboard: {
                membership: membership || null,
                favouriteGym: user?.favouriteGym || null,
                totalVisits: checkinCount,
                recentActivity: recentCheckins,
                upcomingClasses: upcomingBookings
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};