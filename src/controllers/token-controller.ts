import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Define interface for JWT payload
interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET!;
const REFRESH_TOKEN: jwt.Secret = process.env.REFRESH_TOKEN!;

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken =
      req.body.refreshToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    jwt.verify(
      refreshToken,
      REFRESH_TOKEN,
      (
        error: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined,
      ) => {
        if (error) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token",
          });
        }

        // Type guard to ensure decoded is our expected payload
        if (!decoded || typeof decoded === "string") {
          return res.status(403).json({
            success: false,
            message: "Invalid token payload",
          });
        }

        const payload = decoded as JWTPayload;

        const newAccessToken: string = jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          JWT_SECRET,
          { expiresIn: "15m" },
        );

        const newRefreshToken: string = jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          REFRESH_TOKEN,
          { expiresIn: "7d" },
        );

        return res.status(200).json({
          success: true,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      },
    );
  } catch (error) {
    next(error);
  }
};

export default refreshToken;
