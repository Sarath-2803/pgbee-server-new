import { Review, User } from "@/models";
import { Request, Response } from "express";

const createReview = async (req: Request, res: Response) => {
  const userId: string = (req.user as User)?.id;
  const { hostelId, rating, text, image, date } = req.body;

  try {
    const review = await Review.createReview({
      userId,
      hostelId,
      rating,
      text,
      image,
      date,
    });
    if (!review) {
      return res.status(400).json({
        ok: false,
        message: "Failed to create review",
      });
    }
    res.status(201).json({
      ok: true,
      message: "Review created successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to create review",
    });
  }
};

const getReview = async (req: Request, res: Response) => {
  const reviewId: string = req.params.id;
  try {
    const review = await Review.findByPk(reviewId);
    if (review) {
      res.status(200).json({
        ok: true,
        review,
      });
    } else {
      res.status(404).json({
        ok: false,
        message: "Review not found",
      });
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch review",
    });
  }
};

const getReviewsHostel = async (req: Request, res: Response) => {
  const hostelId: string = req.params.id;
  try {
    const reviews: Review[] = await Review.findAll({ where: { hostelId } });
    if (reviews.length > 0) {
      res.status(200).json({
        ok: true,
        reviews,
      });
    } else {
      res.status(404).json({
        ok: false,
        message: "No reviews found for this hostel",
      });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch reviews",
    });
  }
};

const getReviewsUser = async (req: Request, res: Response) => {
  const userId: string = (req.user as User)?.id;
  try {
    const reviews: Review[] = await Review.findAll({ where: { userId } });
    if (reviews.length > 0) {
      res.status(200).json({
        ok: true,
        reviews,
      });
    } else {
      res.status(404).json({
        ok: false,
        message: "No reviews found for this user",
      });
    }
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch user reviews",
    });
  }
};

const updateReview = async (req: Request, res: Response) => {
  const reviewId: string = req.params.id;
  const { rating, text, image } = req.body;
  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        ok: false,
        message: "Review not found",
      });
    }
    await review.update({ rating, text, image });
    res.status(200).json({
      ok: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to update review",
    });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  const reviewId: string = req.params.id;
  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        ok: false,
        message: "Review not found",
      });
    }
    await review.destroy();
    res.status(200).json({
      ok: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to delete review",
    });
  }
};

export default {
  createReview,
  getReview,
  getReviewsHostel,
  getReviewsUser,
  updateReview,
  deleteReview,
};
