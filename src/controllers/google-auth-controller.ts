import passport from "passport";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError, asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";

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
  throw new AppError("SESSION_SECRET environment variable must be set");
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

const googleSuccess = asyncHandler(async (req: Request, res: Response) => {
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

    ResponseHandler.success(
      res,
      "User authenticated successfully",
      {
        accessToken,
        refreshToken,
      },
      200,
    );
  }
});

//signout function on google login
const googleSignout = asyncHandler(async (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      throw new AppError("Logout failed", 500, true);
    }
    if (req.session) {
      req.session.destroy((error: Error) => {
        if (error) throw new AppError("Session  failed", 500, true);
        res.clearCookie("connect.sid");
        ResponseHandler.success(res, "User signed out successfully", {}, 200);
      });
    }
    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  });
});

export default {
  sessionConfig,
  googlelogin,
  googleCallback,
  googleSuccess,
  googleSignout,
};
