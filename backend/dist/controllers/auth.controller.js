import { validateLogin } from "../services/user.service.js";
import { signAccessToken, toPublicUser } from "../utils/auth.js";
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "email and password are required" });
        return;
    }
    const user = await validateLogin(email, password);
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = signAccessToken({
        sub: user.id,
        role: user.role,
        email: user.email,
    });
    res.json({
        token,
        user: toPublicUser(user),
    });
};
export const me = async (req, res) => {
    if (!req.auth) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    res.json({ auth: req.auth });
};
