import { USER_ROLES } from "@/config/consts";
import { protect, restrictTo } from "@/controllers/auth.controller";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setUserAndTourIds,
  updateReview,
} from "@/controllers/review.controller";
import { Router } from "express";

const router = Router({ mergeParams: true });
router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo(USER_ROLES.USER), setUserAndTourIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .delete(restrictTo(USER_ROLES.USER, USER_ROLES.ADMIN), deleteReview)
  .patch(restrictTo(USER_ROLES.USER, USER_ROLES.ADMIN), updateReview);

export { router as reviewsRouter };
