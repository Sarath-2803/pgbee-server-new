import ownerRoutes from "./owner";
import { Router } from "express";

const router = Router();

router.use("/owner", ownerRoutes);

export default router;
