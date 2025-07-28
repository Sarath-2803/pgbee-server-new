import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Role, User } from "@/models/index";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET!;
const REFRESH_TOKEN: jwt.Secret = process.env.REFRESH_TOKEN!;

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // First, check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    //creating new user
    let userRole = await Role.findByName(role);
    if (!userRole) userRole = await Role.createRole({ name: role });

    const newUser = await User.create({
      email,
      password,
      role,
    });

    await newUser.setRole(userRole);

    const accessToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    (error as Error & { status?: number }).status = 500;
    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

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
      REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// export const signout = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: "Signed out successfully",
//       type: "jwt",
//       instructions: {
//         action: "Remove token from client storage",
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export default {
  signup,
  login,
};
