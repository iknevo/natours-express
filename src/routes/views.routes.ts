import { isLoggedIn } from "@/controllers/auth.controller";
import { getLogin, getOverview, getTour } from "@/controllers/views.controller";
import { Router } from "express";

const router = Router();

router.use(isLoggedIn);

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLogin);

export { router as viewsRouter };
