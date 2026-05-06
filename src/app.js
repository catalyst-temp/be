// src/app.js
import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import session from "express-session";
import { configurePassport } from "./config/passport.js";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { checklistRouter } from "./routes/checklist.js";
import { transactionsRouter } from "./routes/transactions.js";

export function createApp() {
  const app = express();
  const passport = configurePassport();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(
    session({
      name: "catalyst.sid",
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: env.mongoUri,
        collectionName: "sessions",
      }),
      // development
      // cookie: {
      //   httpOnly: true,
      //   sameSite: "lax",
      //   secure: false,
      //   maxAge: 1000 * 60 * 60 * 24 * 14,
      // },
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
      },
    }),
  );
  app.set("trust proxy", 1);
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, app: env.appName });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/checklist", checklistRouter);
  app.use("/api/transactions", transactionsRouter);

  app.use((req, res) => {
    res
      .status(404)
      .json({ message: `Route not found: ${req.method} ${req.path}` });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  });

  return app;
}
