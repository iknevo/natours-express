import config from "@/config/config";
import { usersRouter } from "@/routes/auth.routes";
import { toursRouter } from "@/routes/tour.routes";
import express, { NextFunction, Request } from "express";
import morgan from "morgan";
import qs from "qs";

const app = express();

if (config.development) {
  app.use(morgan("dev"));
}
app.set("query parser", (str: string) => qs.parse(str));
app.use(express.json());
app.use(express.static(`public`));
app.use((req: Request & { requestTime?: Date }, _: any, next: NextFunction) => {
  req.requestTime = new Date();
  next();
});
app.use("/api/tours", toursRouter);
app.use("/api/users", usersRouter);

export default app;
