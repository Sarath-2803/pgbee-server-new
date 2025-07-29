import { Router } from "express";
import { reviewController } from "@/controllers";

const reviewRouter = Router();

reviewRouter.post("/", reviewController.createReview);
reviewRouter.get("/user", reviewController.getReviewsUser);
reviewRouter.get("/review/hostel/:id", reviewController.getReviewsHostel);
reviewRouter.get("/:id", reviewController.getReview);
reviewRouter.put("/:id", reviewController.updateReview);
reviewRouter.delete("/:id", reviewController.deleteReview);

export default reviewRouter;
