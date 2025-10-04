import { catchHandler } from "@/utils/catch-handler";
import { Response } from "express";
import { status } from "http-status";
import { Review } from "./review.model";

export const getAllReviews = catchHandler(async (req, res: Response) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(status.OK).json({
    status: { success: true, code: status.OK },
    numItem: reviews.length,
    data: { reviews },
  });
});

export const createReview = catchHandler(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user!.id;
  const review = await Review.create(req.body);
  res.status(status.CREATED).json({
    status: { success: true, code: status.CREATED },
    data: { review },
  });
});
