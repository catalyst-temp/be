// src/routes/auth.js
import express from "express";
import { passport } from "../config/passport.js";
import { env } from "../config/env.js";
import { serializeUser } from "../utils/serializers.js";

function getCookieConfig() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.appEnv !== "local",
  };
}

export const authRouter = express.Router();

authRouter.get("/me", (req, res) => {
  res.json({ user: req.user ? serializeUser(req.user) : null });
});

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
  }),
  (req, res, next) => {
    req.session.save((error) => {
      if (error) return next(error);
      return res.redirect(env.clientUrl);
    });
  },
);

authRouter.get("/google/failure", (_req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

authRouter.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((destroyError) => {
      if (destroyError) return next(destroyError);
      res.clearCookie("catalyst.sid", getCookieConfig());
      return res.json({ ok: true });
    });
  });
});
