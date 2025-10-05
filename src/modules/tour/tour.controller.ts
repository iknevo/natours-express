import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@/factory/handler.factory";
import { Tour } from "@/modules/tour/tour.model";
import { catchHandler } from "@/utils/catch-handler";
import { endOfYear, startOfYear } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { status } from "http-status";

export const aliasTopTours = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// export const getAllTours = catchHandler(async (req: Request, res: Response) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;
//   res.status(status.OK).json({
//     status: { success: true, code: status.OK },
//     numItem: tours.length,
//     data: { tours },
//   });
// });

export const getAllTours = getAll(Tour);
export const getTour = getOne(Tour, { path: "reviews" });
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);

export const getTourStats = catchHandler(
  async (_req: Request, res: Response) => {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      data: { stats },
    });
  },
);

export const getMonthlyPlan = catchHandler(
  async (req: Request, res: Response) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: startOfYear(new Date(year, 0, 1)),
            $lte: endOfYear(new Date(year, 0, 1)),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: {
            $push: "$name",
          },
        },
      },
      { $addFields: { month: "$_id" } },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { numTourStart: -1 } },
    ]);
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      data: { plan },
    });
  },
);
