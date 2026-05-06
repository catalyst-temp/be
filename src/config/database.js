import mongoose from "mongoose";
import { env } from "./env.js";

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);

  connectionPromise ??= mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}
