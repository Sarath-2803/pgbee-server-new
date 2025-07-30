import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError, asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";

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

const refreshToken = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken =
      req.body.refreshToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!refreshToken)
      throw new AppError("Refresh token is required", 401, true);

    jwt.verify(
      refreshToken,
      REFRESH_TOKEN,
      (
        error: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined,
      ) => {
        if (error)
          throw new AppError("Invalid or expired refresh token", 403, true);

        // Type guard to ensure decoded is our expected payload
        if (!decoded || typeof decoded === "string")
          throw new AppError("Invalid or expired refresh token", 403, true);

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

        ResponseHandler.success(
          res,
          "Tokens refreshed successfully",
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          200,
        );
      },
    );
  },
);

export default refreshToken;
