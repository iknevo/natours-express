import { NextFunction, Request, Response } from "express";
import status from "http-status";
export const globalErrorHanlder = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: err.statusCode || status.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal Server Error",
    },
  });
};
