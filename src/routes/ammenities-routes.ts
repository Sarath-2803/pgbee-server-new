import { Router } from "express";
import { ammenitiesController } from "@/controllers";
import { authorize } from "@/middlewares";

const ammenitiesRouter = Router();

ammenitiesRouter.post("/", authorize, ammenitiesController.createAmmenities);

ammenitiesRouter.get(
  "/:id",
  authorize,
  ammenitiesController.getAmmenitiesHostel,
);

ammenitiesRouter.put("/:id", authorize, ammenitiesController.updateAmmenities);

ammenitiesRouter.delete(
  "/:id",
  authorize,
  ammenitiesController.deleteAmmenities,
);

export default ammenitiesRouter;
