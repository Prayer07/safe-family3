// backend/src/server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // you should have auth routes implemented (signup/login)
import familyRoutes from "./routes/family.js";
import locationRoutes from "./routes/location.js";
import sosRoutes from "./routes/sos.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/history", historyRoutes);

const HOST = "0.0.0.0"

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/safefamily";
mongoose.connect(MONGO).then(() => {
  console.log("Mongo connected");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API listening on ${HOST}:${PORT}`));
}).catch((err) => {
  console.error("Mongo connection error:", err);
});