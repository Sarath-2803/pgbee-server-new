import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { User } from "@/models";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/v1/google/callback",
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

        const newUser = await User.create({
          email: email,
          password: "1234",
          role: "user",
        });

        return done(null, newUser);
      } catch (error) {
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
