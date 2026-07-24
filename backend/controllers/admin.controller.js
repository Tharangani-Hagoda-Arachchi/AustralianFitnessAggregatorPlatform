// Get all users 
export const getAllUsers = async (req, res, next) => {
    try {
        const {role, page = 1,limit = 20} = req.query;

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