import { Router } from "express";
import { refreshToken } from "@/controllers";
import { googleAuthController } from "@/controllers";
import { authController } from "@/controllers";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/token/refresh", refreshToken);
authRouter.get("/google", googleAuthController.googlelogin);
authRouter.get(
  "/google/callback",
  googleAuthController.googleCallback,
  googleAuthController.googleSuccess,
);
authRouter.post("/logout", authController.signout);

export default authRouter;
