import { Router } from "express";
import { hostelController } from "@/controllers";
import { authorize } from "@/middlewares";

const hostelRouter = Router();

hostelRouter.get("/", authorize, hostelController.getAllHostelsStudent);
hostelRouter.get("/user", authorize, hostelController.getAllHostelsOwner);
hostelRouter.post("/hostel", authorize, hostelController.regHostel);
hostelRouter.put("/hostel/:id", authorize, hostelController.updateHostel);
hostelRouter.delete("/hostel/:id", authorize, hostelController.deleteHostel);

export default hostelRouter;
