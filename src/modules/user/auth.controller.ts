import type { Request, Response } from "express";
import { status } from "http-status";

export const getAllUsers = (_req: Request, res: Response) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: status.INTERNAL_SERVER_ERROR,
      message: "this route is not implemented yet!",
    },
  });
};
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
