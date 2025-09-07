import dbConnect from "@/config/db";
import { Tour } from "@/modules/tour/tour.model";
import { APIFeatures } from "@/utils/api-features";
import { AppError } from "@/utils/app-error";
import { catchHandler } from "@/utils/catch-handler";
import { endOfYear, startOfYear } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { status } from "http-status";
import mongoose from "mongoose";

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

export const getAllTours = catchHandler(async (req: Request, res: Response) => {
  await dbConnect();
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res.status(status.OK).json({
    status: { success: true, code: status.OK },
    numItem: tours.length,
    data: { tours },
  });
});

export const getTour = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await dbConnect();
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid Id format", status.BAD_REQUEST));
    }
    const tour = await Tour.findById(id);
    if (!tour) {
      return next(new AppError("Tour not found", status.NOT_FOUND));
    }
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      data: { tour },
    });
  },
);

export const createTour = catchHandler(async (req: Request, res: Response) => {
  await dbConnect();
  const tour = await Tour.create(req.body);
  res.status(status.CREATED).json({
    status: { success: true, code: status.CREATED },
    data: { tour },
  });
});

export const updateTour = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await dbConnect();
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid Id format", status.BAD_REQUEST));
    }
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      // to return the new updated tour
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return next(new AppError("Tour not found", status.NOT_FOUND));
    }
    res.status(status.OK).json({
      status: { code: status.OK, success: true },
      data: { tour },
    });
  },
);

export const deleteTour = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await dbConnect();
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid Id", status.BAD_REQUEST));
    }
    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) {
      return next(new AppError("Tour not found", status.NOT_FOUND));
    }
    res
      .status(status.NO_CONTENT)
      .json({ status: { code: status.NO_CONTENT, success: true }, data: null });
  },
);

export const getTourStats = catchHandler(
  async (_req: Request, res: Response) => {
    await dbConnect();
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
    await dbConnect();
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
