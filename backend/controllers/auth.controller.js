import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/use.model.js";
import { createAccessToken, createRefreshToken } from "../utils/tokn.utils.js";

dotenv.config()
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    path: '/'
}

//user registration 
export const userRegister = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        //check email already exiist or not
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        //hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const safeRole = role === 'owner' ? 'owner' : 'user';

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: safeRole
        });
        await user.save();

        res.status(201).json({
            message: "registered successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};

//user login
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //chechk email or password empty
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });

        }

        //check user exiist or not
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!existingUser.isActive) {
            return res.status(4013).json({
                message: "This account has been deleted"
            });
        }

        //match password
        const isMatchPassword = await bcrypt.compare(password, existingUser.password);
        if (!isMatchPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        existingUser.lastLoginAt = new Date();

        //create tokens
        const paylod = { id: existingUser._id, role: existingUser.role };
        const accessToken = createAccessToken(paylod, ACCESS_TOKEN_SECRET, '15m');
        const refreshToken = createRefreshToken(paylod, REFRESH_TOKEN_SECRET, '7d');

        //save refresh token
        existingUser.refreshToken.push(refreshToken);
        await existingUser.save();

        //send refresh token as cookies
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            message: "Login successfully",
            accessToken,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};