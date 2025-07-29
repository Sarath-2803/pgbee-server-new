import { Router } from "express";
import { authorize } from "@/middlewares";
import { refreshToken } from "@/controllers";
import { googleAuthController } from "@/controllers";
import { authController } from "@/controllers";

const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/signup", authController.signup);

authRouter.post("/token/refresh", authorize, refreshToken);

authRouter.get("/google", googleAuthController.googlelogin);

authRouter.get(
  "/google/callback",
  googleAuthController.googleCallback,
  googleAuthController.googleSuccess,
);

export default authRouter;
