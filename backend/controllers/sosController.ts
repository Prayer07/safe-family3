// backend/src/controllers/sosController.ts
import { sendPushNotification } from "../services/firebase.js";
import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { SosAlert } from "../models/SosAlert.js";
import { Family } from "../models/Family.js";
import mongoose from "mongoose";

export const triggerSos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { coords } = req.body as { coords?: { lat: number; lng: number } };
    
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Get user info
    const user = await User.findById(userId).select("name");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get family
    const family = await Family.findOne({ members: userId }).populate("members", "name pushToken");
    if (!family) return res.status(404).json({ message: "No family" });

    // Create SOS alert
    const sos = await SosAlert.create({
      family: family._id,
      triggeredBy: new mongoose.Types.ObjectId(userId),
      coords,
      status: "triggered",
      timestamp: new Date(),
      responders: [],
    });

    // Send push notifications to all family members
    const notifications = family.members
      .filter((member: any) => 
        member._id.toString() !== userId && 
        member.pushToken
      )
      .map((member: any) =>
        sendPushNotification(
          member.pushToken,
          "🚨 EMERGENCY ALERT",
          `${user.name} needs help!`,
          {
            type: "sos",
            sosId: family.toString(),
            lat: coords?.lat?.toString() || "",
            lng: coords?.lng?.toString() || "",
            userName: user.name,
          }
        )
      );

    await Promise.allSettled(notifications);

    res.status(201).json(sos);
  } catch (err) {
    console.error("SOS trigger error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// // backend/src/controllers/sosController.ts
// import type { Request, Response } from "express";
// import { SosAlert } from "../models/SosAlert.js";
// import { Family } from "../models/Family.js";
// import mongoose from "mongoose";

// export const triggerSos = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { coords } = req.body as { coords?: { lat: number; lng: number } };
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const family = await Family.findOne({ members: userId });
//     if (!family) return res.status(404).json({ message: "No family" });

//     const sos = await SosAlert.create({
//       family: family._id,
//       triggeredBy: new mongoose.Types.ObjectId(userId),
//       coords,
//       status: "triggered",
//       timestamp: new Date(),
//       responders: [],
//     });

//     // TODO: emit socket.io event and trigger push/SMS via Twilio
//     // e.g. io.to(`family:${family._id}`).emit("sos:new", sos);

//     res.status(201).json(sos);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const acknowledgeSos = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const sosId = req.params.id;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const sos = await SosAlert.findById(sosId);
//     if (!sos) return res.status(404).json({ message: "Not found" });

//     sos.status = "acknowledged";
//     sos.responders.push(new mongoose.Types.ObjectId(userId));
//     await sos.save();

//     // TODO: io.to(`family:${sos.family}`).emit("sos:update", sos);

//     res.json(sos);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };