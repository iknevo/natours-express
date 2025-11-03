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

export function getTour(_req: Request, res: Response) {
  res.status(status.OK).render("tour", {
    title: "test tour",
  });
}
