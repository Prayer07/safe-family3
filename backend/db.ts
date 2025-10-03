import mongoose from "mongoose";
// import { MONGO_URI } from "./config";

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};