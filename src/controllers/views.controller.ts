import { Request, Response } from "express";
import { status } from "http-status";

export function getOverview(_req: Request, res: Response) {
  res.status(status.OK).render("overview", {
    title: "All Tours",
  });
}

export function getTour(_req: Request, res: Response) {
  res.status(status.OK).render("tour", {
    title: "test tour",
  });
}
