// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin";
  phone?: string;
  isVerified: boolean;
  sellerRequest: boolean; // true if requested upgrade
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    sellerRequest: { type: Boolean, default: false }, // if buyer applies to be seller
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
