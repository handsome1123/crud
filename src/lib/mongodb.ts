import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Define a type for cached connection
interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use global object to persist connection across hot reloads
const globalWithMongoose = global as typeof global & {
  mongoose?: Cached;
};

const cached: Cached = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached;
  return cached.conn;
}
