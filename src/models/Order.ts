// Order.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: { product: mongoose.Types.ObjectId; quantity: number; price: number }[];
  total: number;
  status: "pending" | "completed" | "cancelled";
}

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, quantity: Number, price: Number }],
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
