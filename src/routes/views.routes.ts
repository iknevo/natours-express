import { getOverview, getTour } from "@/controllers/views.controller";
import { Router } from "express";

const router = Router();

router.get("/", getOverview);
router.get("/tour/:slug", getTour);

export { router as viewsRouter };
