import { Router } from "express";
import { ammenitiesController } from "@/controllers";

const ammenitiesRouter = Router();

ammenitiesRouter.post("/", ammenitiesController.createAmmenities);
ammenitiesRouter.get("/:id", ammenitiesController.getAmmenitiesHostel);
ammenitiesRouter.put("/:id", ammenitiesController.updateAmmenities);
ammenitiesRouter.delete("/:id", ammenitiesController.deleteAmmenities);

export default ammenitiesRouter;
