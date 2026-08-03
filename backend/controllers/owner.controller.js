import mongoose from "mongoose";
import { Gym } from "../models/gym.model.js";
import { GymClass } from "../models/gymClass.model.js";
import { Booking } from "../models/bookings.model.js";
import { Checkin } from "../models/checkin.model.js";
import { Payment } from "../models/payment.model.js";

// Get gym analytics (Owner)
export const getGymAnalytics = async (req, res, next) => {
    try {
        const { gymId } = req.params;
        const { from, to } = req.query;

        // Create date filter
        const dateFilter = {};
        if (from) {
            dateFilter.$gte = new Date(from);
        }

        if (to) {
            dateFilter.$lte = new Date(to);
        }

        const hasDateFilter = Object.keys(dateFilter).length > 0;

        // Get analytics data
        const [
            checkinCount,
            revenueAgg,
            bookingCount,
            upcomingClasses,
            recentCheckins

        ] = await Promise.all([


            // Total check-ins
            Checkin.countDocuments({
                gym: gymId,
                ...(hasDateFilter && {
                    checkedInAt: dateFilter
                })
            }),

            // Total revenue
            Payment.aggregate([
                {
                    $match: {
                        gym: new mongoose.Types.ObjectId(gymId),
                        status: "succeeded",

                        ...(hasDateFilter && {
                            createdAt: dateFilter
                        })
                    }
                },

                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),


            // Active bookings
            Booking.countDocuments({
                gym: gymId,
                status: "booked"
            }),


            // Upcoming classes
            GymClass.find({
                gym: gymId,
                status: "scheduled",
                startTime: {
                    $gte: new Date()
                }
            })
                .sort({
                    startTime: 1
                })
                .limit(10)
                .select(
                    "name startTime capacity bookedCount"
                ),

            // Recent check-ins
            Checkin.find({
                gym: gymId
            })
                .populate(
                    "user",
                    "name"
                )
                .sort({
                    checkedInAt: -1
                })
                .limit(20)

        ]);


        // Revenue details
        const revenue = revenueAgg[0] || {
            total: 0,
            count: 0
        };


        // Calculate class capacity utilisation
        const capacityBreakdown = upcomingClasses.map((gymClass) => ({
            classId: gymClass._id,
            name: gymClass.name,
            startTime: gymClass.startTime,
            capacity: gymClass.capacity,
            booked: gymClass.bookedCount,

            utilisationPct:
                Math.round(
                    (gymClass.bookedCount / gymClass.capacity) * 100
                )
        }));


        res.status(200).json({
            success: true,
            message: "Gym analytics fetched successfully",

            analytics: {
                totalCheckins: checkinCount,
                totalRevenue: revenue.total,
                totalTransactions: revenue.count,
                activeBookings: bookingCount,
                capacityBreakdown,
                recentCheckins
            }
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get gyms owned by logged-in owner
export const getMyGyms = async (req, res, next) => {
    try {

        // Find gyms created by logged-in owner
        const gyms = await Gym.find({
            owner: req.user._id
        });

        res.status(200).json({
            success: true,
            message: "Owner gyms fetched successfully",
            count: gyms.length,
            gyms
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};