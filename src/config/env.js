// src/config/env.js
import dotenv from "dotenv";

dotenv.config();

export const env = {
  appName: process.env.APP_NAME || "Catalyst",
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  clientUrl: process.env.CLIENT_URL,
};

export function validateEnv() {
  const required = [
    ["MONGODB_URI", env.mongoUri],
    ["SESSION_SECRET", env.sessionSecret],
    ["GOOGLE_CLIENT_ID", env.googleClientId],
    ["GOOGLE_CLIENT_SECRET", env.googleClientSecret],
    ["GOOGLE_CALLBACK_URL", env.googleCallbackUrl],
    ["CLIENT_URL", env.clientUrl],
  ];

  const missing = required.filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
