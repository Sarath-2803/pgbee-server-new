import { studentController } from "@/controllers";
import { Router } from "express";

const router = Router();

router.get("/", studentController.getAll);
router.get("/:id", studentController.get);
router.post("/", studentController.create);
router.put("/:id", studentController.update);
router.delete("/:id", studentController.deleteStudent);

export default router;
