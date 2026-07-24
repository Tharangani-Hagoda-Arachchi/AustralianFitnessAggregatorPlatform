import jwt from "jsonwebtoken";
import { User } from "../models/use.model.js";
import { verifyToken } from "../utils/tokn.utils.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        //autherization header checking
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Access Denied, Token not found"
            });
        }

        //verify token
        const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded.id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({
                message: "Access Denied, You are not login"
            });
        }

        //store user is req object
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

//role authorization
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbiden, no permision to access"
            });
        }
        next();
    };
};