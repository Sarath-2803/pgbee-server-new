import routes from "@/controllers/index";
import { Router } from "express";
import { authorize } from "@/middlewares/auth-middleware";
import { refreshToken } from "@/controllers/token-controller";

const authRouter = Router();

authRouter.post("/login", routes.login);

authRouter.post("/signup", routes.signup);

// authRouter.post('/logout',signout);

authRouter.post("/token/refresh", refreshToken);

//google routes
authRouter.get("/google", routes.googlelogin);

authRouter.get("/google/callback", routes.googleCallback, routes.googleSuccess);

authRouter.get("/test", authorize, (req, res) => {
  res.json({ message: "Test route is working" });
});

export default authRouter;
