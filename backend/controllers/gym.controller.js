import { Gym } from "../models/gym.model.js";
import { User } from "../models/use.model.js";

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
