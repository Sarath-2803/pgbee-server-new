import { Router } from "express";
import hostelController from "@/controllers/hostel-controller";
import { authorize } from "@/middlewares/auth-middleware";

const hostelRouter = Router();

hostelRouter.get("/", authorize, hostelController.getAllHostelsStudent);
hostelRouter.get("/user", authorize, hostelController.getAllHostelsOwner);
hostelRouter.post("/hostel", authorize, hostelController.regHostel);
hostelRouter.put("/hostel/:id", authorize, hostelController.updateHostel);
hostelRouter.delete("/hostel/:id", authorize, hostelController.deleteHostel);

export default hostelRouter;
