import { JwtPayload } from "./models.js";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export {};
