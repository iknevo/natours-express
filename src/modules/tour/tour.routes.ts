import { USER_ROLES } from "@/config/consts";
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  updateTour,
} from "@/modules/tour/tour.controller";
import { protect, restrictTo } from "@/modules/user/auth.controller";
import express from "express";
import { reviewsRouter } from "../review/review.routes";

const router = express.Router();
// /tours/tourId/reviews
router.use("/:tourId/reviews", reviewsRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    protect,
    restrictTo(USER_ROLES.ADMIN, USER_ROLES.LEAD_GUIDE, USER_ROLES.GUIDE),
    getMonthlyPlan,
  );
router
  .route("/tours-within/:distance/center/:coords/unit/:unit")
  .get(getToursWithin);
router.route("/distances/:coords/unit/:unit").get(getDistances);
router
  .route("/")
  .get(getAllTours)
  .post(
    protect,
    restrictTo(USER_ROLES.ADMIN, USER_ROLES.LEAD_GUIDE),
    createTour,
  );
router
  .route("/:id")
  .get(getTour)
  .patch(
    protect,
    restrictTo(USER_ROLES.ADMIN, USER_ROLES.LEAD_GUIDE),
    updateTour,
  )
  .delete(
    protect,
    restrictTo(USER_ROLES.ADMIN, USER_ROLES.LEAD_GUIDE),
    deleteTour,
  );

export { router as toursRouter };
