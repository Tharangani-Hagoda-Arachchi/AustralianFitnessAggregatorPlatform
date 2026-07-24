import { Gym } from "../models/gym.model.js";
import { User } from "../models/use.model.js";
import mongoose from "mongoose";

//create new gym
export const createGym = async (req, res, next) => {
    try {
        const gym = new Gym({
            ...req.body,
            owner: req.user._id,
            status: req.user.role === 'admin' ? 'approved' : 'pending',

        })

        await gym.save();

        // Add the gym to the owner's ownedGyms array in User model 
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    ownedGyms: gym._id
                }
            }
        );

        res.status(201).json({
            message: "Gym created successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};

// Get gyms by filtering and searching
export const getGyms = async (req, res, next) => {
    try {
        const {
            q,
            facility,
            minPrice,
            maxPrice,
            lat,
            lng,
            radiusKm = 10,
            page = 1,
            limit = 20,
        } = req.query;

        // Default filter
        const filter = {
            status: "approved",
            isActive: true,
        };

        // Search by name/description
        if (q) {
            filter.$text = {
                $search: q,
            };
        }

        // Filter by facility
        if (facility) {
            filter.facilities = facility;
        }

        // Filter by price
        if (minPrice || maxPrice) {
            filter.pricePerVisit = {};

            if (minPrice) {
                filter.pricePerVisit.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.pricePerVisit.$lte = Number(maxPrice);
            }
        }

        // Nearby search
        if (lat && lng) {
            filter.location = {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            Number(lng), // longitude
                            Number(lat), // latitude
                        ],
                    },
                    $maxDistance: Number(radiusKm) * 1000,
                },
            };
        }

        // Pagination
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        // Build query
        let gymQuery = Gym.find(filter)
            .skip(skip)
            .limit(pageSize);

        // Only sort by rating if NOT doing geospatial search
        if (!(lat && lng)) {
            gymQuery = gymQuery.sort({
                "rating.average": -1,
            });
        }

        const gyms = await gymQuery;

        let total;


        if (lat && lng) {
            total = gyms.length;
        } else {
            total = await Gym.countDocuments(filter);
        }

        res.status(200).json({
            success: true,
            message: "Gyms fetched successfully",
            count: gyms.length,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / pageSize),
            gyms,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//get gym by id 
export const getGymById = async (req, res, next) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid gym ID"
        });
    }
    // Find gym by ID and populate owner details
    const gym = await Gym.findById(id)
        .populate("owner", "name email");

    // Check whether the gym exists
    if (!gym) {
        return res.status(404).json({
            success: false,
            message: "Gym not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Gym fetched successfully",
        gym
    });
}

// Update gym
export const updateGym = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gym ID"
            });
        }
        const updateData = { ...req.body };

        // Prevent owner from changing approval status
        // or transferring gym ownership
        delete req.body.status;
        delete req.body.owner;

        // Update gym details
        const gym = await Gym.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
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
            message: "Gym updated successfully",
            gym
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// delete gym
export const deleteGym = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gym ID"
            });
        }

        // Delete gym by ID
        const gym = await Gym.findByIdAndDelete(id);

        // Check gym exists
        if (!gym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Gym Delete successfully",

        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Toggle favourite gym
export const toggleFavourite = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if gym exists
        const gym = await Gym.findById(id);

        if (!gym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found"
            });
        }

        // Get logged-in user
        const user = req.user;

        // Check whether gym is already favourited
        const isFavourited =
            String(user.favouriteGym) === String(gym._id);

        user.favouriteGym = isFavourited
            ? null
            : gym._id;


        // Save user favourite without validation
        await user.save({
            validateBeforeSave: false
        });

        res.status(200).json({
            success: true,
            message: isFavourited
                ? "Gym removed from favourites"
                : "Gym added to favourites",
            favourited: !isFavourited,
            favouriteGym: user.favouriteGym
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};