import { USER_ROLES } from "@/config/consts";
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
