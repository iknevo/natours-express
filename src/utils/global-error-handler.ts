import config from "@/config/config";
import { AppError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";

function handleCastErr(err: any) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, status.BAD_REQUEST);
}
function handleDuplicateErr(err: any) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value for field (${field}: ${value}). Please use another value!`;
  return new AppError(message, status.BAD_REQUEST);
}
function handleValidationErr(err: any) {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, status.BAD_REQUEST);
}

function handleJwtError() {
  return new AppError(
    "Invalid Token, Please login again.",
    status.UNAUTHORIZED,
  );
}
function handleJwtExpired() {
  return new AppError(
    "Expired Session, Please login again.",
    status.UNAUTHORIZED,
  );
}

function sendErrorDev(err: any, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err: any, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong, Please try again!",
    });
  }
}

export const globalErrorHanlder = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  if (config.development) {
    sendErrorDev(err, res);
  } else if (config.production) {
    let error = err;
    if (error.name === "CastError") error = handleCastErr(error);
    if (error.code === 11000) error = handleDuplicateErr(error);
    if (error.name === "ValidationError") error = handleValidationErr(error);
    if (error instanceof jwt.JsonWebTokenError) error = handleJwtError();
    if (error instanceof jwt.TokenExpiredError) error = handleJwtExpired();
    sendErrorProd(error, res);
  }
};
