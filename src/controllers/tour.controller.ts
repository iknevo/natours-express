import dbConnect from "@/config/db";
import { Tour } from "@/models/tour.model";
import { APIFeatures } from "@/utils/api-features";
import type { NextFunction, Request, Response } from "express";
import { status } from "http-status";

// export const checkId = (

//   _: any,
//   res: Response,
//   next: NextFunction,
//   id: string,
// ) => {
//   const tour = toursData.find((el: any) => el.id === +id);
//   if (!tour || Object.keys(tour).length === 0) {
//     return res.status(status.NOT_FOUND).json({
//       status: {
//         success: false,
//         code: status.NOT_FOUND,
//         message: "No tour found",
//       },
//     });
//   }
//   return next();
// };
// export const checkBody = (req: Request, res: Response, next: NextFunction) => {
//   const { name, price } = req.body;
//   if (!name || !price) {
//     return res.status(status.BAD_REQUEST).json({
//       status: {
//         success: false,
//         code: status.BAD_REQUEST,
//         message: "invalid body",
//       },
//     });
//   }
//   return next();
// };
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
    // 1. filtering
    // const allowedFilters = Object.keys(Tour.schema.paths);
    // const filters = Object.fromEntries(
    //   Object.entries(rawFilters).filter(([key]) =>
    //     allowedFilters.includes(key),
    //   ),
    // );
    // let filterStr = JSON.stringify(filters);
    // filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`);
    // const mongoFilters = JSON.parse(filterStr);
    // let query = Tour.find(mongoFilters);
    // { duration: { gte: "5", }, difficulty: "easy"}
    // 2. sorting
    // if (sort) {
    //   const sortBy = (sort as string).split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }
    // 3. field limiting
    // if (fields) {
    //   const selectedFields = (fields as string).split(",").join(" ");
    //   query = query.select(selectedFields).select("-__v");
    // } else {
    //   query = query.select("-__v");
    // }

    // 4. pagination

    const tours = await query;
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      // pagination: {
      //   page: pageNum,
      //   limit: limitNum,
      //   totalItems: totalDocs,
      //   totalPages: totalPages,
      //   hasNextPage: pageNum < totalPages,
      //   hasPrevPage: pageNum > 1,
      // },
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
