import mongoose from "mongoose";
import { Gym } from "../models/gym.model.js";
import { validateQrToken } from "../utils/qrService.js";
import { Checkin } from "../models/checkin.model.js";

// Returns today's date in Australia/Sydney timezone
function getLocalDateKey(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Australia/Sydney",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
}


// Check in to a gym
export const checkIn = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const { gymId, qrToken } = req.body;


        // Check gym exists and is active
        const gym = await Gym.findOne({
            _id: gymId,
            isActive: true,
            status: "approved"
        });

        if (!gym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found or not available"
            });
        }


        // Validate QR token
        let qrPayload;

        try {

            qrPayload = validateQrToken(qrToken, userId);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        // Check QR belongs to this gym
        if (String(qrPayload.gymId) !== String(gymId)) {

            return res.status(400).json({
                success: false,
                message: "This QR pass was generated for a different gym"
            });

        }


        // Today's date
        const todayKey = getLocalDateKey();


        // Check whether user already checked in today
        const existingCheckin = await Checkin.findOne({
            user: userId,
            checkinDate: todayKey
        }).sort({
            checkedInAt: -1
        });


        // Prevent check-in to different gym on same day
        if (
            existingCheckin &&
            String(existingCheckin.gym) !== String(gymId)
        ) {

            return res.status(409).json({
                success: false,
                message: "You have already checked into a different gym today."
            });

        }


        // Create new check-in
        const checkin = await Checkin.create({

            user: userId,
            gym: gymId,
            checkinDate: todayKey,
            method: "qr",
            qrTokenId: qrPayload.tokenId

        });


        // Send response
        res.status(201).json({

            success: true,

            message: existingCheckin
                ? "Re-entry recorded for the same gym."
                : "Checked in successfully.",

            checkin

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }
};


// Get logged-in user's check-in history
export const getMyCheckinHistory = async (req, res, next) => {
    try {

        // Get last 50 check-ins
        const checkins = await Checkin.find({

            user: req.user._id

        })
            .populate(
                "gym",
                "name address.suburb"
            )
            .sort({
                checkedInAt: -1
            })
            .limit(50);


        // Send response
        res.status(200).json({

            success: true,
            message: "Check-in history fetched successfully",
            count: checkins.length,
            checkins

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }
};


// Get today's check-ins for a gym
export const getGymCheckinsToday = async (req, res, next) => {
    try {

        const { gymId } = req.params;

        // Today's date
        const todayKey = getLocalDateKey();


        // Find today's check-ins
        const checkins = await Checkin.find({

            gym: gymId,
            checkinDate: todayKey

        })
            .populate(
                "user",
                "name email"
            )
            .sort({
                checkedInAt: -1
            });


        // Send response
        res.status(200).json({

            success: true,
            message: "Today's check-ins fetched successfully",
            count: checkins.length,
            checkins

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }
};