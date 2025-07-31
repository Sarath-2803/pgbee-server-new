import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Role, User } from "@/models";
import jwt from "jsonwebtoken";
import { AppError, asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET!;
const REFRESH_TOKEN: jwt.Secret = process.env.REFRESH_TOKEN!;

const signup = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, password, phoneNo, role } = req.body;

    if (!email || !password || !role || !name || !phoneNo)
      throw new AppError("Email, password, role, name are required");

    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new AppError("User with this email already exists");

    //creating new user
    let userRole = await Role.findByName(role);
    if (!userRole) userRole = await Role.createRole({ name: role });

    const newUser = await User.create({
      name,
      email,
      phoneNo,
      password,
      roleId: userRole.id,
    });
    await newUser.save();

    ResponseHandler.success(
      res,
      "User created successfully",
      {
        newUser,
      },
      201,
    );
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      throw new AppError("Email and password are required");

    const user = await User.findByEmail(email);
    if (!user) throw new AppError("User not found");

    console.log("isPasswordValid:", await user.verifyPassword(password));
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password");
    }

    const accessToken = jwt.sign(
      {
        userId: user.dataValues.id,
        email: user.dataValues.email,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.dataValues.id,
        email: user.dataValues.email,
      },
      REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    ResponseHandler.success(
      res,
      "User logged in successfully",
      {
        accessToken,
      },
      200,
    );
  },
);

export const signout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("jwt");
    ResponseHandler.success(res, "User signed out successfully", {}, 200);
  },
);

export default {
  signup,
  login,
  signout,
};
