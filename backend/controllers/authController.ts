// backend/src/controllers/authController.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

function generateToken(user: IUser): string {
  return jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: "7d" });
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body as {
      name: string;
      email: string;
      phone?: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: hash,
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
    console.log(token)
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string; }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      // pushToken: user.pushToken
    });
    console.log(token)
  } catch (err: any) {
    console.error("Login error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const pushToken =  async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ message: "Push token required" });
    }

    await User.findByIdAndUpdate(userId, { pushToken });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to save push token" });
  }
};

export const updatePushToken = async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token)
      return res.status(400).json({ message: "Missing userId or token" });

    const user = await User.findByIdAndUpdate(
      userId,
      { pushToken: token },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ success: true, pushToken: token });
  } catch (err) {
    console.error("Error updating push token:", err);
    res.status(500).json({ message: "Server error" });
  }
};