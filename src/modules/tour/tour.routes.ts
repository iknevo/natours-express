import { USER_ROLES } from "@/config/consts";
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getTour,
  getTourStats,
  updateTour,
} from "@/modules/tour/tour.controller";
import { protect, restrictTo } from "@/modules/user/auth.controller";
import express from "express";
import { reviewsRouter } from "../review/review.routes";

const router = express.Router();
// router.param("id", checkId);

// /tours/tourId/reviews
router.use("/:tourId/reviews", reviewsRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(
    protect,
    restrictTo(USER_ROLES.ADMIN, USER_ROLES.LEAD_GUIDE),
    deleteTour,
  );

export { router as toursRouter };
