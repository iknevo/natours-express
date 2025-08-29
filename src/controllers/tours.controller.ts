import type { NextFunction, Request, Response } from "express";
import { status } from "http-status";
import { readFileSync, writeFile } from "node:fs";

const toursData = JSON.parse(
  readFileSync("./dev-data/data/tours-simple.json", "utf-8"),
);
export const checkId = (
  _: any,
  res: Response,
  next: NextFunction,
  id: string,
) => {
  const tour = toursData.find((el: any) => el.id === +id);
  if (!tour || Object.keys(tour).length === 0) {
    return res.status(status.NOT_FOUND).json({
      status: {
        success: false,
        code: status.NOT_FOUND,
        message: "No tour found",
      },
    });
  }
  return next();
};
export const checkBody = (req: Request, res: Response, next: NextFunction) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(status.BAD_REQUEST).json({
      status: {
        success: false,
        code: status.BAD_REQUEST,
        message: "invalid body",
      },
    });
  }
  return next();
};
export const getAllTours = (_: any, res: Response) => {
  res.status(status.OK).json({
    status: { success: true, code: status.OK },
    results: toursData.length,
    data: { tours: toursData },
  });
};
export const getTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = toursData.find((el: any) => el.id === +id!);
  res
    .status(status.OK)
    .json({ status: { success: true, code: status.OK }, data: { tour } });
};
export const createTour = (req: Request, res: Response) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  toursData.push(newTour);
  writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(toursData),
    (err) => {
      if (err) console.log(err);
      res.status(status.CREATED).json({
        status: { success: true, code: status.CREATED },
        data: { tour: newTour },
      });
    },
  );
};
export const updateTour = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(status.OK).json({
    status: { code: status.OK, success: true },
    data: { tour: `<Updated Tour> ${id}` },
  });
};
export const deleteTour = (_: any, res: Response) => {
  res
    .status(status.NO_CONTENT)
    .json({ status: { code: status.NO_CONTENT, success: true }, data: null });
};
