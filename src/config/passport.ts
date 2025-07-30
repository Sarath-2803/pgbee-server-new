import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Role, User } from "@/models";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

function generateRandomPassword(length = 12): string {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error("No email found in profile"), undefined);
        }

        const email = profile.emails[0].value;
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
          return done(null, existingUser);
        }

        let userRole = await Role.findByName("user");
        if (!userRole) {
          userRole = await Role.createRole({ name: "user" });
        }

        const newUser = await User.create({
          name: profile.displayName || "User",
          email: email,
          password: generateRandomPassword(12),
          roleId: userRole.id,
        });

        return done(null, newUser);
      } catch (error) {
        console.error("Error in Google authentication:", error);
        return done(error, undefined);
      }
    },
  ),
);

passport.serializeUser((user, done: VerifyCallback) => {
  done(null, user);
});

passport.deserializeUser(async (email: string, done: VerifyCallback) => {
  try {
    const user = await User.findByEmail(email);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), false);
    }
  } catch (error) {
    done(error, false);
  }
});

export default passport;
