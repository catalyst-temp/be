import dotenv from "dotenv";

dotenv.config();

export const env = {
  appName: process.env.APP_NAME || "Catalyst",
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export function validateEnv() {
  const required = [
    ["MONGODB_URI", env.mongoUri],
    ["SESSION_SECRET", env.sessionSecret],
    ["GOOGLE_CLIENT_ID", env.googleClientId],
    ["GOOGLE_CLIENT_SECRET", env.googleClientSecret],
  ];

  const missing = required.filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
