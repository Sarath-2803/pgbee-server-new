import { Router } from "express";
import { reviewController } from "@/controllers";
import { authorize } from "@/middlewares";

const reviewRouter = Router();

reviewRouter.post("/", authorize, reviewController.createReview);
reviewRouter.get("/user", authorize, reviewController.getReviewsUser);
reviewRouter.get(
  "/review/hostel/:id",
  authorize,
  reviewController.getReviewsHostel,
);
reviewRouter.get("/:id", authorize, reviewController.getReview);
reviewRouter.put("/:id", authorize, reviewController.updateReview);
reviewRouter.delete("/:id", authorize, reviewController.deleteReview);

export default reviewRouter;
