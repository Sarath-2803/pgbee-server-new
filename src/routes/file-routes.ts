import { fileController } from "@/controllers";
import { upload } from "@/utils";
import { Router } from "express";

const router = Router();

router.post("/", upload.single("file"), fileController.uploadFile);
router.get("/", fileController.getAllFile);
router.get("/:key", fileController.getFile);

export default router;
