import type { Response } from "express";
import { status } from "http-status";

export const getAllUsers = (_: any, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const getUser = (_: any, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const createUser = (_: any, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const updateUser = (_: any, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
export const deleteUser = (_: any, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
