import { catchHandler } from "@/utils/catch-handler";
import { Response } from "express";
import { status } from "http-status";
import { Review } from "./review.model";

export const getAllReviews = catchHandler(async (_req, res: Response) => {
  const reviews = await Review.find();
  res.status(status.OK).json({
    status: { success: true, code: status.OK },
    numItem: reviews.length,
    data: { reviews },
  });
});

export const createReview = catchHandler(async (req, res) => {
  const review = await Review.create(req.body);

  res.status(status.CREATED).json({
    status: { success: true, code: status.CREATED },
    data: { review },
  });
});
