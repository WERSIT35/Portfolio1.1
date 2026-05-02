import { Router } from "express";
import {
  createAdminUser,
  getUsers,
  patchAdminUser,
  removeAdminUser,
} from "../controllers/admin-users.controller.js";
import { writeSection } from "../controllers/content.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get("/users", requireRole(["super_admin"]), getUsers);
adminRouter.post("/users", requireRole(["super_admin"]), createAdminUser);
adminRouter.patch("/users/:id", requireRole(["super_admin"]), patchAdminUser);
adminRouter.delete("/users/:id", requireRole(["super_admin"]), removeAdminUser);

adminRouter.put(
  "/content/:section",
  requireRole(["super_admin", "editor"]),
  writeSection
);
