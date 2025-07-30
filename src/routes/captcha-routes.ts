import { Router } from "express";
import { cookieController } from "@/controllers";

const captchaRouter = Router();
captchaRouter.post("/", cookieController);

export default captchaRouter;
