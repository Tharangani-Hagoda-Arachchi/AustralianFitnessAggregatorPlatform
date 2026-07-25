import jwt from "jsonwebtoken";
import crypto from "crypto";

// QR token expiry time (seconds)
export const QR_EXPIRY_SECONDS = 60;

// Generate QR token
export const generateQrToken = (userId, gymId) => {

    // Generate unique token ID
    const tokenId = crypto.randomUUID();

    // Create JWT token
    const token = jwt.sign(

        {
            userId,
            gymId,
            tokenId,
            purpose: "qr_checkin"
        },

        process.env.QR_JWT_SECRET,

        {
            expiresIn: QR_EXPIRY_SECONDS
        }

    );

    // Return token details
    return {
        token,
        tokenId,
        expiresIn: QR_EXPIRY_SECONDS
    };

};


// Validate QR token
export const validateQrToken = (token, expectedUserId) => {

    let payload;

    try {

        // Verify token
        payload = jwt.verify(
            token,
            process.env.QR_JWT_SECRET
        );

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            throw new Error(
                "QR pass has expired, please generate a new one"
            );
        }

        throw new Error("Invalid QR pass");

    }


    // Check token purpose
    if (payload.purpose !== "qr_checkin") {
        throw new Error("Invalid QR pass");
    }


    // Check token belongs to logged-in user
    if (String(payload.userId) !== String(expectedUserId)) {
        throw new Error(
            "This QR pass does not belong to the logged-in user"
        );
    }


    // Return decoded payload
    return payload;

};