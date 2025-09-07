import config from "@/config/config";
import { toursRouter } from "@/modules/tour/tour.routes";
import { usersRouter } from "@/modules/user/auth.routes";
import { AppError } from "@/utils/app-error";
import express, { NextFunction, Request, Response } from "express";
import status from "http-status";
import morgan from "morgan";
import qs from "qs";

const app = express();

if (config.development) {
  app.use(morgan("dev"));
}

app.set("query parser", (str: string) => qs.parse(str));
app.use(express.json());
app.use(express.static(`public`));
app.use(
  (
    req: Request & { requestTime?: Date },
    _res: Response,
    next: NextFunction,
  ) => {
    req.requestTime = new Date();
    next();
  },
);
app.use((req, _res, next) => {
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: true,
  });
  next();
});

app.use("/api/tours", toursRouter);
app.use("/api/users", usersRouter);
app.all(/.*/, (req, _res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      status.NOT_FOUND,
    ),
  );
});
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
    status: {
      success: false,
      code: err.statusCode || status.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal Server Error",
    },
  });
});

export default app;
