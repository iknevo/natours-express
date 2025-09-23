import {
  forgotPassword,
  login,
  logout,
  protect,
  refresh,
  resetPassword,
  signup,
  updatePassword,
} from "@/modules/user/auth.controller";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "@/modules/user/user.controller";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protect, updatePassword);

router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", protect, deleteMe);

//todo: remove testing
router.post("/refresh", refresh);
router.post("/logout", logout);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export { router as usersRouter };
