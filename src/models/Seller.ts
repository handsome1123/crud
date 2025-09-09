import mongoose, { Schema, Document } from "mongoose";

export interface ISeller extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  documents?: string[];
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    wallet?: string;
  };
}

const SellerSchema = new Schema<ISeller>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    documents: [{ type: String }],
    bankDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      wallet: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Seller ||
  mongoose.model<ISeller>("Seller", SellerSchema);
