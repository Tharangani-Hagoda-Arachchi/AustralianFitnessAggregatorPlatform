import mongoose from "mongoose";
import { GymClass } from "../models/gymClass.model.js";
import { Booking } from "../models/bookings.model.js";

// Get classes for a gym
export const getClassesForGym = async (req, res, next) => {
    try {

        const { gymId } = req.params;

        // Get upcoming scheduled classes
        const classes = await GymClass.find({

            gym: gymId,
            status: "scheduled",
            startTime: {
                $gte: new Date()
            }

        }).sort({
            startTime: 1
        });

        res.status(200).json({
            success: true,
            message: "Classes fetched successfully",
            classes
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Create gym class
export const createClass = async (req, res, next) => {
    try {

        const {
            startTime,
            endTime
        } = req.body;


        // Check end time is after start time
        if (new Date(endTime) <= new Date(startTime)) {

            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });

        }
        // Create class
        const gymClass = await GymClass.create(req.body);

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            class: gymClass
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Create booking
export const createBooking = async (req, res, next) => {

    const session = await mongoose.startSession();

    let booking;

    try {
        const {
            gymClassId
        } = req.body;

        const userId = req.user._id;

        await session.withTransaction(async () => {
            // Find class
            const gymClass = await GymClass.findById(gymClassId)
                .session(session);

            if (!gymClass) {
                throw new Error("Class not found");
            }

            // Check class status
            if (gymClass.status !== "scheduled") {
                throw new Error(
                    "This class is not open for booking"
                );
            }

            // Check class already started
            if (new Date(gymClass.startTime) <= new Date()) {
                throw new Error(
                    "Cannot book a class that has already started"
                );
            }

            // Increase booked count only if capacity available
            const updatedClass =
                await GymClass.findOneAndUpdate(
                    {
                        _id: gymClassId,
                        $expr: {
                            $lt: [
                                "$bookedCount",
                                "$capacity"
                            ]
                        }
                    },

                    {
                        $inc: {
                            bookedCount: 1
                        }
                    },

                    {
                        new: true,
                        session
                    }

                );

            if (!updatedClass) {

                throw new Error(
                    "This class is fully booked"
                );

            }

            // Create booking
            const createdBooking =
                await Booking.create(
                    [{
                        user: userId,
                        gymClass: gymClassId,
                        gym: updatedClass.gym,
                        status: "booked"
                    }],
                    {
                        session
                    }
                );
            booking = createdBooking[0];

        });

        res.status(201).json({
            success: true,
            message: "Class booked successfully",
            booking
        });

    } catch (error) {

        // Duplicate booking
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already booked this class"
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        session.endSession();
    }

};




// Cancel booking
export const cancelBooking = async (req, res, next) => {

    const session = await mongoose.startSession();


    try {
        await session.withTransaction(async () => {
            // Find user's booking
            const booking =
                await Booking.findOne({
                    _id: req.params.id,
                    user: req.user._id
                }).session(session);

            if (!booking) {
                throw new Error(
                    "Booking not found"
                );
            }

            if (booking.status !== "booked") {
                throw new Error(
                    "Booking is not active"
                );
            }

            // Cancel booking
            booking.status = "cancelled";
            booking.cancelledAt = new Date();

            await booking.save({
                session
            });

            // Reduce booked count
            await GymClass.findByIdAndUpdate(

                booking.gymClass,

                {
                    $inc: {
                        bookedCount: -1
                    }
                },
                {
                    session
                }
            );
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        session.endSession();
    }

};


// Get logged-in user's bookings
export const getMyBookings = async (req, res, next) => {

    try {
        const bookings =
            await Booking.find({
                user: req.user._id,
                status: "booked"
            }).populate({
                path: "gymClass",
                select: "name startTime endTime instructor"
            }).populate({
                path: "gym",
                select: "name"
            }).sort({
                "gymClass.startTime": 1
            });

        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};