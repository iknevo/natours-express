import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "@/modules/user/auth.controller";
import express from "express";

const router = express.Router();
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export { router as usersRouter };
