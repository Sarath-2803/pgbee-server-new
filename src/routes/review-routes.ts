import { Router } from "express";
import { reviewController } from "@/controllers";
import { authorize } from "@/middlewares";

const reviewRouter = Router();

reviewRouter.post("/create", authorize, reviewController.createReview);
reviewRouter.get("/review/user", authorize, reviewController.getReviewsUser);
reviewRouter.get(
  "/review/hostel/:id",
  authorize,
  reviewController.getReviewsHostel,
);
reviewRouter.get("/review/:id", authorize, reviewController.getReview);
reviewRouter.put("/review/:id", authorize, reviewController.updateReview);
reviewRouter.delete("/review/:id", authorize, reviewController.deleteReview);

export default reviewRouter;
