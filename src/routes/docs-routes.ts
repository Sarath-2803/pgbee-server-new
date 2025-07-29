import { docs, apiSpec } from "@/utils";
import { Router } from "express";

const router = Router();
router.get("/docs", docs);
router.get("/api-spec", apiSpec);

export default router;
