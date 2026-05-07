import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(rootDir, ".env") });

const appEnv = process.env.APP_ENV || "local";
if (!/^[a-zA-Z0-9_-]+$/.test(appEnv)) {
  throw new Error("APP_ENV may only contain letters, numbers, hyphens, and underscores");
}

dotenv.config({ path: path.join(rootDir, `.env.${appEnv}`) });

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
