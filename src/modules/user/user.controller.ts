import { catchHandler } from "@/utils/catch-handler";
import type { Request, Response } from "express";
import { status } from "http-status";
import { User } from "./user.model";

export const getAllUsers = catchHandler(
  async (_req: Request, res: Response) => {
    const users = await User.find();
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      numItem: users.length,
      data: { users },
    });
  },
);
export const getUser = (_req: Request, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const createUser = (_req: Request, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const updateUser = (_req: Request, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const deleteUser = (_req: Request, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
