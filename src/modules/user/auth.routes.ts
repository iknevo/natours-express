import {
  forgotPassword,
  login,
  logout,
  refresh,
  resetPassword,
  signup,
} from "@/modules/user/auth.controller";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "@/modules/user/user.controller";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

//todo: remove testing
router.post("/refresh", refresh);
router.post("/logout", logout);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export { router as usersRouter };
