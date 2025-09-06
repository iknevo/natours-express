import dbConnect from "@/config/db";
import { Tour } from "@/modules/tour/tour.model";
import { APIFeatures } from "@/utils/api-features";
import { endOfYear, startOfYear } from "date-fns";
import type { NextFunction, Request, Response } from "express";
import { status } from "http-status";

export const aliasTopTours = (req: Request, _: any, next: NextFunction) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
export const getAllTours = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields();

    const { query, pagination } = await features.paginate();

    const tours = await query;
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      pagination,
      data: { tours },
    });
  } catch {
    res.status(status.BAD_REQUEST).json({
      status: {
        success: false,
        code: status.BAD_REQUEST,
        message: "Invalid Data sent!",
      },
    });
  }
};
export const getTour = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      data: { tour },
    });
  } catch {
    res.status(status.NOT_FOUND).json({
      status: {
        success: false,
        code: status.NOT_FOUND,
        message: "Invalid Data sent!",
      },
    });
  }
};
export const createTour = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const tour = await Tour.create(req.body);

    res.status(status.CREATED).json({
      status: { success: true, code: status.CREATED },
      data: { tour },
    });
  } catch {
    res.status(status.BAD_REQUEST).json({
      status: {
        success: false,
        code: status.BAD_REQUEST,
        message: "Invalid Data sent!",
      },
    });
  }
};
export const updateTour = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      // to return the new updated tour
      new: true,
      runValidators: true,
    });

    res.status(status.OK).json({
      status: { code: status.OK, success: true },
      data: { tour },
    });
  } catch {
    res.status(status.NOT_FOUND).json({
      status: {
        success: false,
        code: status.NOT_FOUND,
        message: "Invalid Data sent!",
      },
    });
  }
};
export const deleteTour = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);

    res
      .status(status.NO_CONTENT)
      .json({ status: { code: status.NO_CONTENT, success: true }, data: null });
  } catch {
    res.status(status.NOT_FOUND).json({
      status: {
        success: false,
        code: status.NOT_FOUND,
        message: "Invalid Data sent!",
      },
    });
  }
};
export const getTourStats = async (_: any, res: Response) => {
  try {
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
      // {
      //   $match: { _id: { $ne: "EASY" } },
      // },
    ]);
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      data: { stats },
    });
  } catch {
    res.status(status.BAD_REQUEST).json({
      status: {
        success: false,
        code: status.BAD_REQUEST,
        message: "Invalid Data sent!",
      },
    });
  }
};
export const getMonthlyPlan = async (req: Request, res: Response) => {
  try {
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
  } catch {
    res.status(status.BAD_REQUEST).json({
      status: {
        success: false,
        code: status.BAD_REQUEST,
        message: "Invalid Data sent!",
      },
    });
  }
};
