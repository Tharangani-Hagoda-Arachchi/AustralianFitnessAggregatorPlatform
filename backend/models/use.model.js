import mongoose from "mongoose";

//create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        minlength: 2,
        maxlength: 60,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'admin'],
        default: 'user',
    },
    //only role owner
    ownedGyms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym',
        },
    ],
    favouriteGym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true, // admin can disable/ban a user 
    },
    lastLoginAt: {
        type: Date,
    },
    refreshToken: {
        type: [String],
        default: []
    }

}, {
    timestamps: true,
}

);

export const User = mongoose.model("User", userSchema);