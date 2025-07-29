import { Router } from "express";
import { hostelController } from "@/controllers";

const hostelRouter = Router();

hostelRouter.post("/", hostelController.regHostel);
hostelRouter.get("/", hostelController.getAllHostelsStudent);
hostelRouter.get("/user", hostelController.getAllHostelsOwner);
hostelRouter.put("/:id", hostelController.updateHostel);
hostelRouter.delete("/:id", hostelController.deleteHostel);

export default hostelRouter;
