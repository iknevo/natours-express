import { Tour } from "@/models/tour.model";
import { AppError } from "@/utils/app-error";
import { catchHandler } from "@/utils/catch-handler";
import { NextFunction, Request, Response } from "express";
import { status } from "http-status";

export const getOverview = catchHandler(
  async (_req: Request, res: Response) => {
    const tours = await Tour.find();
    res.status(status.OK).render("overview", {
      title: "All Tours",
      tours
    });
  }
);

export const getTour = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const tour = await Tour.findOne({ slug }).populate({
      path: "reviews",
      select: "review rating user"
    });

    if (!tour) {
      return next(new AppError("Document not found", status.NOT_FOUND));
    }

    res.status(status.OK).render("tour", {
      title: `${tour.name} tour`,
      tour
    });
  }
);

export const getLogin = catchHandler(async (_req: Request, res: Response) => {
  res.status(status.OK).render("login", {
    title: "Log into your account"
  });
});
