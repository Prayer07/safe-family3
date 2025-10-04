import type { Request, Response } from "express";
import { Family } from "../models/Family.js";
import { Location } from "../models/Location.js";
import { SosAlert } from "../models/SosAlert.js";
import { User } from "../models/User.js"; // 👈 Make sure this is exported from your User model

interface PopulatedLocation {
  _id: string;
  type: "location";
  user: { _id: string; name: string; phone: string } | null;
  coords: { lat: number; lng: number };
  timestamp: Date;
}

interface PopulatedSos {
  _id: string;
  type: "sos";
  triggeredBy: { _id: string; name: string; phone: string } | null;
  coords: { lat: number; lng: number };
  status: string;
  timestamp: Date;
}

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: "No family" });

    const memberIds = family.members as unknown as string[];

    // ✅ populate user info for locations
    const locations = await Location.find({ user: { $in: memberIds } })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate("user", "name phone")
      .lean<PopulatedLocation[]>();

    // ✅ populate user info for sos
    const sos = await SosAlert.find({ family: family._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("triggeredBy", "name phone")
      .lean<PopulatedSos[]>();

    const hist = [
      ...locations.map((l) => ({
        _id: l._id,
        type: "location" as const,
        user: l.user?.name ?? "Unknown", // ✅ no any here
        coords: l.coords,
        timestamp: l.timestamp,
      })),
      ...sos.map((s) => ({
        _id: s._id,
        type: "sos" as const,
        triggeredBy: s.triggeredBy?.name ?? "Unknown", // ✅ type-safe
        coords: s.coords,
        status: s.status,
        timestamp: s.timestamp,
      })),
    ];

    hist.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(hist);
  } catch (err) {
    console.error("❌ History error:", err);
    res.status(500).json({ message: "Server error" });
  }
};