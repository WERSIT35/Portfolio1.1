import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
export const hashPassword = async (password) => {
    return bcrypt.hash(password, 12);
};
export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};
export const signAccessToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};
export const toPublicUser = (user) => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};
