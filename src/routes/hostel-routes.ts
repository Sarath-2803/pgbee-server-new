import { Router } from "express";
import { hostelController } from "@/controllers";
import { authorize } from "@/middlewares";

const hostelRouter = Router();

hostelRouter.post("/", authorize, hostelController.regHostel);
hostelRouter.get("/", authorize, hostelController.getAllHostelsStudent);
hostelRouter.get("/user", authorize, hostelController.getAllHostelsOwner);
hostelRouter.put("/:id", authorize, hostelController.updateHostel);
hostelRouter.delete("/:id", authorize, hostelController.deleteHostel);

export default hostelRouter;
