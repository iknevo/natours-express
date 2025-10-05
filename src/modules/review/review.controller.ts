import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@/factory/handler.factory";
import { NextFunction, Request, Response } from "express";
import { Review } from "./review.model";

export const setUserAndTourIds = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user!.id;
  next();
};
export const getAllReviews = getAll(Review);
export const getReview = getOne(Review, { path: "tour", select: "name" });
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
