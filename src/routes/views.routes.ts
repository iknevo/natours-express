import { getOverview, getTour } from "@/controllers/views.controller";
import { Router } from "express";

const router = Router();

router.get("/", getOverview);
router.get("/tour", getTour);

export { router as viewsRouter };
