import { Router } from "express";
import { authorize } from "@/middlewares/auth-middleware";
import { refreshToken } from "@/controllers/token-controller";
import googleAuthController from "@/controllers/google-auth-controller";
import authController from "@/controllers/user-auth-controller";

const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/signup", authController.signup);

// authRouter.post('/logout',signout);

authRouter.post("/token/refresh", refreshToken);

//google routes
authRouter.get("/google", googleAuthController.googlelogin);

authRouter.get(
  "/google/callback",
  googleAuthController.googleCallback,
  googleAuthController.googleSuccess,
);

authRouter.get("/test", authorize, (req, res) => {
  res.json({ message: "Test route is working" });
});

export default authRouter;
