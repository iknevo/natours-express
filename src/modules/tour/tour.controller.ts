import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@/factory/handler.factory";
import { Tour } from "@/modules/tour/tour.model";
import { AppError } from "@/utils/app-error";
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

// /tours-within/:distance/center/:coords/unit/:unit
// /tours-within/220/center/31.017199, 30.404611/unit/km
enum EARTH_RADIUS {
  KM = 6378.152,
  MI = 3963.2,
}
export const getToursWithin = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance, coords, unit } = req.params;
    const [lat, lng] = coords.split(",");
    const sphereRadius =
      unit === "mi"
        ? Number(distance) / EARTH_RADIUS.MI
        : Number(distance) / EARTH_RADIUS.KM;
    if (!lat || !lng) {
      next(
        new AppError(
          "Please provide latitude and longitude in the format lat, lng",
          status.BAD_REQUEST,
        ),
      );
    }
    const data = { distance, lat, lng, unit, sphereRadius };

    // $geoWithin: { $centerSphere: [[lng, lat], radius] },
    // earth radius = 3963.2 mi || 6378.152 km
    const tours = await Tour.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[lng, lat], sphereRadius] },
      },
    });

    console.log(data);
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      numItems: tours.length,
      data: { tours },
    });
  },
);

export const getDistances = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coords, unit } = req.params;
    const [lat, lng] = coords.split(",");
    if (!lat || !lng) {
      next(
        new AppError(
          "Please provide latitude and longitude in the format lat, lng",
          status.BAD_REQUEST,
        ),
      );
    }
    const data = { lat, lng, unit };
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          distanceField: "distance",
        },
      },
      {
        $addFields: {
          distance: {
            $round: [
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: [unit, "km"] },
                      then: { $divide: ["$distance", 1000] },
                    },
                    {
                      case: { $eq: [unit, "mi"] },
                      then: { $divide: ["$distance", 1609.34] },
                    },
                  ],
                  default: "$distance",
                },
              },
              2,
            ],
          },
          distanceUnit: unit,
        },
      },
      {
        $project: {
          name: 1,
          distance: 1,
          distanceUnit: 1,
        },
      },
    ]);
    console.log(data);
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      numItems: distances.length,
      data: { distances },
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
