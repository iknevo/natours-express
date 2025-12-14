import config from "@/config/config";
import { usersRouter } from "@/routes/auth.routes";
import { reviewsRouter } from "@/routes/review.routes";
import { toursRouter } from "@/routes/tour.routes";
import { viewsRouter } from "@/routes/views.routes";
import { AppError } from "@/utils/app-error";
import { globalErrorHandler } from "@/utils/global-error-handler";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import status from "http-status";
import morgan from "morgan";
import path from "path";
import qs from "qs";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again in 1 hour."
});
app.use("/api", limiter);

if (config.development) {
  app.use(morgan("dev"));
}

app.set("query parser", (str: string) => qs.parse(str));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(
  express.json({
    limit: "10kb"
  })
);
app.use(cookieParser());
interface RequestWithTime extends Request {
  requestTime?: Date;
}
app.use((req: RequestWithTime, _res: Response, next: NextFunction) => {
  req.requestTime = new Date();
  next();
});
app.use((req, _res, next) => {
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: true
  });
  next();
});
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

app.use("/", viewsRouter);
app.use("/api/tours", toursRouter);
app.use("/api/users", usersRouter);
app.use("/api/reviews", reviewsRouter);

app.all(/.*/, (req, _res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on the server`,
      status.NOT_FOUND
    )
  );
});
app.use(globalErrorHandler);

export default app;
