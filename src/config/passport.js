// src/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";
import { User } from "../models/User.js";

let configured = false;

export function configurePassport() {
  if (configured) return passport;
  configured = true;

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const avatarUrl = profile.photos?.[0]?.value || "";
          const name = profile.displayName || email || "Catalyst User";

          if (!email) {
            return done(
              new Error("Google account does not expose an email address"),
            );
          }

          const user = await User.findOneAndUpdate(
            { googleId: profile.id },
            { email, name, avatarUrl },
            { new: true, upsert: true, setDefaultsOnInsert: true },
          );

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  return passport;
}

export { passport };
