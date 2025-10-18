// backend/src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatarUrl?: string;
  lastActiveAt?: Date;
  pushToken?: string[], // ✅ Add this
  family?: mongoose.Types.ObjectId | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  lastActiveAt: { type: Date },
  pushToken: { type: [String], default: [] }, // ✅ Add this
  family: { type: Schema.Types.ObjectId, ref: "Family", default: null },
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);