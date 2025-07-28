import passport from "passport";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Define interface for authenticated user
interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

const sessionConfig = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax" as const,
  },
};

const googlelogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
});

const googleSuccess = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as AuthenticatedUser;
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Google authentication successful",
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

//signout function on google login
const googleSignout = (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Logout failed", error });
    }
    if (req.session) {
      req.session.destroy((error: Error) => {
        if (error) {
          return res
            .status(500)
            .json({ success: false, message: "Logout failed", error });
        }
        res.clearCookie("connect.sid");
        return res
          .status(200)
          .json({ success: true, message: "Logged out successfully" });
      });
    }
    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  });
};

export default {
  sessionConfig,
  googlelogin,
  googleCallback,
  googleSuccess,
  googleSignout,
};
