import { Router } from "express";
import { readContent, readSection } from "../controllers/content.controller.js";
export const contentRouter = Router();
contentRouter.get("/", readContent);
contentRouter.get("/:section", readSection);
