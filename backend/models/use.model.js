import mongoose from "mongoose";
import crypto from "crypto";

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
    
    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

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

// Instance method: generate a password reset token (raw token returned, hashed one stored)
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
};

export const User = mongoose.model("User", userSchema);