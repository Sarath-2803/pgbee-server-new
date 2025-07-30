import { AppError, asyncHandler } from "@/middlewares";
import { Review, User } from "@/models";
import { ResponseHandler } from "@/utils";
import { Request, Response } from "express";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId: string = (req.user as User)?.id;
  const name: string = (req.user as User)?.name;
  const { hostelId, rating, text, image, date } = req.body;

  const review = await Review.createReview({
    userId,
    hostelId,
    name,
    rating,
    text,
    image,
    date,
  });
  if (!review) throw new AppError("Failed to create review");
  ResponseHandler.success(res, "Review created successfully", {}, 201);
});

const getReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId: string = req.params.id;
  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError("Review not found");
  ResponseHandler.success(res, "Review fetched successfully", { review }, 200);
});

const getReviewsHostel = asyncHandler(async (req: Request, res: Response) => {
  const hostelId: string = req.params.id;

  const reviews: Review[] = await Review.findAll({ where: { hostelId } });
  if (reviews.length < 0) {
    throw new AppError("No reviews found for this hostel");
  }
  ResponseHandler.success(
    res,
    "Reviews fetched successfully",
    { reviews },
    200,
  );
});

const getReviewsUser = asyncHandler(async (req: Request, res: Response) => {
  const userId: string = (req.user as User)?.id;
  const reviews: Review[] = await Review.findAll({ where: { userId } });
  if (reviews.length < 0) {
    throw new AppError("No reviews found for this user");
  }
  ResponseHandler.success(
    res,
    "Reviews fetched successfully",
    { reviews },
    200,
  );
});

const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId: string = req.params.id;
  const { rating, text, image } = req.body;
  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError("Review not found");
  const updatedReview = await review.update({ rating, text, image });
  if (!updatedReview) throw new AppError("Failed to update review");
  ResponseHandler.success(res, "Review updated successfully", {}, 200);
});

const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId: string = req.params.id;

  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError("Review not found");
  await review.destroy();
  ResponseHandler.success(res, "Review deleted successfully", {}, 200);
});

export default {
  createReview,
  getReview,
  getReviewsHostel,
  getReviewsUser,
  updateReview,
  deleteReview,
};
