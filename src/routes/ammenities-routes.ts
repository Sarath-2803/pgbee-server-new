import { Router } from "express";
import { ammenitiesController } from "@/controllers";
import { authorize } from "@/middlewares";

const ammenitiesRouter = Router();

ammenitiesRouter.post(
  "/ammenities/create",
  authorize,
  ammenitiesController.createAmmenities,
);
ammenitiesRouter.put(
  "/ammenities/update/:id",
  authorize,
  ammenitiesController.updateAmmenities,
);
ammenitiesRouter.get(
  "/ammenities/hostel/:id",
  authorize,
  ammenitiesController.getAmmenitiesHostel,
);
// ammenitiesRouter.get(
//   "/ammenities/hostel/:id",
//   authorize,
//   ammenitiesController.getAmmenitiesHostel,
// );
// ammenitiesRouter.get("/ammenities/:id", authorize, ammenitiesController.getAmmenities);
// ammenitiesRouter.put("/ammenities/:id", authorize, ammenitiesController.updateAmmenities);
// ammenitiesRouter.delete("/ammenities/:id", authorize, ammenitiesController.deleteAmmenities);

export default ammenitiesRouter;
