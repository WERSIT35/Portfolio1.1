import { v4 as uuid } from "uuid";
import { readDb, writeDb } from "../store/db.js";
import { AdminRole, AdminUser } from "../types/models.js";
import { comparePassword, hashPassword } from "../utils/auth.js";

export const validateLogin = async (email: string, password: string) => {
  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.isActive) return null;
  const match = await comparePassword(password, user.passwordHash);
  if (!match) return null;

  user.lastLoginAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  await writeDb(db);
  return user;
};

export const listUsers = async (): Promise<AdminUser[]> => {
  const db = await readDb();
  return db.users;
};

export const createUser = async (payload: {
  fullName: string;
  email: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUser> => {
  const db = await readDb();
  const existing = db.users.some(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase()
  );
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const now = new Date().toISOString();
  const user: AdminUser = {
    id: uuid(),
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: await hashPassword(payload.password),
    role: payload.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(user);
  await writeDb(db);
  return user;
};

export const updateUser = async (
  id: string,
  payload: Partial<{
    fullName: string;
    role: AdminRole;
    isActive: boolean;
    password: string;
  }>
): Promise<AdminUser | null> => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === id);
  if (!user) return null;

  if (typeof payload.fullName === "string") user.fullName = payload.fullName.trim();
  if (payload.role) user.role = payload.role;
  if (typeof payload.isActive === "boolean") user.isActive = payload.isActive;
  if (payload.password) user.passwordHash = await hashPassword(payload.password);
  user.updatedAt = new Date().toISOString();

  await writeDb(db);
  return user;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const db = await readDb();
  const before = db.users.length;
  db.users = db.users.filter((item) => item.id !== id);
  if (db.users.length === before) return false;
  await writeDb(db);
  return true;
};
