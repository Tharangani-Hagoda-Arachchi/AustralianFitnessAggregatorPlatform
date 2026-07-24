import jwt from "jsonwebtoken";

//create access token
export const createAccessToken = (paylod, secret, expiresIn) => {
    return jwt.sign(paylod, secret, { expiresIn });
};

//create refresh token
export const createRefreshToken = (paylod, secret, expiresIn) => {
    return jwt.sign(paylod, secret, { expiresIn });
};

//verify token
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};