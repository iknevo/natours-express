import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  getTourStats,
  updateTour,
} from "@/controllers/tour.controller";
import express from "express";

const router = express.Router();
// router.param("id", checkId);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export { router as toursRouter };
