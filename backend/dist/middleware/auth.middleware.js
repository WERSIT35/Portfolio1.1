import { verifyAccessToken } from "../utils/auth.js";
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing or invalid Authorization header" });
        return;
    }
    const token = authHeader.slice("Bearer ".length);
    try {
        req.auth = verifyAccessToken(token);
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
export const requireRole = (allowed) => (req, res, next) => {
    if (!req.auth) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!allowed.includes(req.auth.role)) {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
    }
    next();
};
