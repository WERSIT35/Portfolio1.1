import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: parseNumber(process.env.PORT, 4300),
  jwtSecret: process.env.JWT_SECRET || "dev_change_this_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4200",
  dataFilePath: process.env.DATA_FILE_PATH || "data/db.json",
};
