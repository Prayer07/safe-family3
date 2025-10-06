// backend/src/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No auth" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify((token as string), JWT_SECRET) as { sub: string };
    // payload.sub expected to be user id
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};