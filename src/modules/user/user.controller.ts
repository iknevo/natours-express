import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@/factory/handler.factory";
import { User, UserDocument } from "@/modules/user/user.model";
import { AppError } from "@/utils/app-error";
import { catchHandler } from "@/utils/catch-handler";
import type { NextFunction, Request, Response } from "express";
import { status } from "http-status";

function filterObj(obj: any, allowedFields: string[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key)),
  );
}

export const getMe = (req: Request, _res: Response, next: NextFunction) => {
  const { id } = req.user as UserDocument;
  req.params.id = id;
  next();
};

export const updateMe = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user as UserDocument;
    const { password, passwordConfirm } = req.body;
    if (password || passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates please use /user/update-password",
          status.BAD_REQUEST,
        ),
      );
    }
    const filteredBody = filterObj(req.body, ["name", "email", "admin"]);
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });
    return res.status(status.OK).json({
      status: "success",
      user: updatedUser,
    });
  },
);

export const deleteMe = catchHandler(async (req: Request, res: Response) => {
  const { id } = req.user as UserDocument;
  await User.findByIdAndUpdate(id, { active: false });
  return res.status(status.NO_CONTENT).json({
    status: "success",
    user: null,
  });
});

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const createUser = (_req: Request, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented!, Please use /signup",
    },
  });
};
