import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Role, User } from "@/models";
import jwt from "jsonwebtoken";
import { asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET!;
const REFRESH_TOKEN: jwt.Secret = process.env.REFRESH_TOKEN!;

const signup = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, password, role } = req.body;

    if (!email || !password || !role || !name)
      throw new Error("Email, password, role and name are required");

    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error("User with this email already exists");

    //creating new user
    let userRole = await Role.findByName(role);
    if (!userRole) userRole = await Role.createRole({ name: role });

    const newUser = await User.create({
      name,
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

    ResponseHandler.success(
      res,
      "User created successfully",
      {
        accessToken,
        refreshToken,
      },
      201,
    );
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("Email and password are required");

    const user = await User.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
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

    ResponseHandler.success(
      res,
      "User logged in successfully",
      {
        accessToken,
        refreshToken,
      },
      200,
    );
  },
);

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
