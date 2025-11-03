import { USER_ROLES } from "@/config/consts";
import {
  forgotPassword,
  login,
  logout,
  protect,
  refresh,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from "@/controllers/auth.controller";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "@/controllers/user.controller";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.post("/refresh", refresh);

router.use(protect);

router.patch("/update-password", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

router.post("/logout", logout);

router.use(restrictTo(USER_ROLES.ADMIN));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export { router as usersRouter };
