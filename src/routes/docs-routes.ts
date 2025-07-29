import { docs, apiSpec } from "@/utils";
import { Router } from "express";

const router = Router();
router.get("/", docs);
router.post("/", apiSpec);

export default router;
