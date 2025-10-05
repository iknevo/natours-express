import { protect, restrictTo } from "@/modules/user/auth.controller";
import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setUserAndTourIds,
  updateReview,
} from "./review.controller";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setUserAndTourIds, createReview);

router.route("/:id").get(getReview).delete(deleteReview).patch(updateReview);

export { router as reviewsRouter };
