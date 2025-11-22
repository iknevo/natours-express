import { Tour } from "@/models/tour.model";
import { catchHandler } from "@/utils/catch-handler";
import { Request, Response } from "express";
import { status } from "http-status";

export const getOverview = catchHandler(
  async (_req: Request, res: Response) => {
    const tours = await Tour.find();
    res.status(status.OK).render("overview", {
      title: "All Tours",
      tours,
    });
  },
);

export const getTour = catchHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: "reviews",
    select: "review rating user",
  });

  res.status(status.OK).render("tour", {
    title: `${tour.name} tour`,
    tour,
  });
});
