import { protect, restrictTo } from "@/modules/user/auth.controller";
import { Router } from "express";
import { createReview, getAllReviews } from "./review.controller";

const router = Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

export { router as reviewsRouter };
