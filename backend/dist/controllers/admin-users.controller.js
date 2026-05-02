import { createUser, deleteUser, listUsers, updateUser, } from "../services/user.service.js";
import { toPublicUser } from "../utils/auth.js";
const isRole = (value) => {
    return ["super_admin", "editor", "viewer"].includes(value);
};
export const getUsers = async (_req, res) => {
    const users = await listUsers();
    res.json(users.map(toPublicUser));
};
export const createAdminUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role || !isRole(role)) {
        res.status(400).json({ message: "fullName, email, password, valid role are required" });
        return;
    }
    try {
        const user = await createUser({ fullName, email, password, role });
        res.status(201).json(toPublicUser(user));
    }
    catch (error) {
        if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
            res.status(409).json({ message: "Email already exists" });
            return;
        }
        res.status(500).json({ message: "Failed to create user" });
    }
};
export const patchAdminUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, role, isActive, password } = req.body;
    if (role && !isRole(role)) {
        res.status(400).json({ message: "Invalid role value" });
        return;
    }
    const updated = await updateUser(id, {
        fullName,
        role: role,
        isActive,
        password,
    });
    if (!updated) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(toPublicUser(updated));
};
export const removeAdminUser = async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.auth?.sub;
    if (id === currentUserId) {
        res.status(400).json({ message: "You cannot delete your own account" });
        return;
    }
    const deleted = await deleteUser(id);
    if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(204).send();
};
