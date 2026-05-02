import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { contentRouter } from "./routes/content.routes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "5mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "portfolio-admin-backend" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/admin", adminRouter);

  return app;
};
