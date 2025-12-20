import { getLogin, getOverview, getTour } from "@/controllers/views.controller";
import { Router } from "express";

const router = Router();

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLogin);

export { router as viewsRouter };
