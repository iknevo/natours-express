import {
  checkBody,
  checkId,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from "@/controllers/tours.controller";
import express from "express";

const router = express.Router();
router.param("id", checkId);

router.route("/").get(getAllTours).post(checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export { router as toursRouter };
