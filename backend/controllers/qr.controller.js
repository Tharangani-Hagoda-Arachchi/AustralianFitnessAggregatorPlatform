import QRCode from "qrcode";
import { generateQrToken, QR_EXPIRY_SECONDS } from "../utils/qrService.js";
import { Gym } from "../models/gym.model.js";

// Generate QR pass
export const generateQrPass = async (req, res, next) => {
    try {

        const { gymId } = req.body;

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

        // Generate QR token
        const {
            token,
            tokenId,
            expiresIn
        } = generateQrToken(req.user._id, gymId);

        // Convert token into QR image
        const qrImage = await QRCode.toDataURL(token, {
            errorCorrectionLevel: "M"
        });

        // Send response
        res.status(200).json({
            success: true,
            message: "QR pass generated successfully",
            qrImage,
            tokenId,
            expiresIn,
            expiresAt: new Date(
                Date.now() + expiresIn * 1000
            )
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Export QR expiry time
export { QR_EXPIRY_SECONDS };