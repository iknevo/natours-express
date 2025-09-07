import config from "@/config/config";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

function sendErrorDev(err: any, res: Response) {
  res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: err.statusCode || status.INTERNAL_SERVER_ERROR,
    },
    error: err,
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });
}

function sendErrorProd(err: any, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
      status: {
        success: false,
        code: err.statusCode || status.INTERNAL_SERVER_ERROR,
      },
      message: err.message || "Internal Server Error",
    });
  } else {
    console.error(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      status: {
        success: false,
        code: status.INTERNAL_SERVER_ERROR,
      },
      message: "Something went wrong, Please try again later!",
    });
  }
}

export const globalErrorHanlder = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (config.development) {
    sendErrorDev(err, res);
  } else if (config.production) {
    sendErrorProd(err, res);
  }
};
