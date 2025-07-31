import { Router } from "express";
import { rentController } from "@/controllers";

const rentRouter = Router();

rentRouter.post("/", rentController.addRent);
rentRouter.get("/:id", rentController.getRentByHostelId);
rentRouter.put("/:id", rentController.updateRent);
rentRouter.delete("/:id", rentController.deleteRent);

export default rentRouter;
