import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const appEnv = process.env.APP_ENV || "local";
if (!/^[a-zA-Z0-9_-]+$/.test(appEnv)) {
  throw new Error(
    "APP_ENV may only contain letters, numbers, hyphens, and underscores",
  );
}

function normalizeUrl(value) {
  return value?.replace(/\/+$/, "");
}

export const env = {
  appEnv,
  appName: process.env.APP_NAME || "Catalyst",
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  clientUrl: normalizeUrl(process.env.CLIENT_URL),
};

export function validateEnv() {
  const required = [
    "MONGODB_URI",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "SESSION_SECRET",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing env variables: ${missing.join(", ")}`);
  }
}
