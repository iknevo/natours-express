import dbConnect from "@/config/db";
import { Tour } from "@/models/tour.model";
import type { Request, Response } from "express";
import { status } from "http-status";

// const toursData = JSON.parse(
//   readFileSync("./dev-data/data/tours-simple.json", "utf-8"),
// );
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

export const getAllTours = async (_: any, res: Response) => {
  try {
    await dbConnect();
    const tours = await Tour.find();

    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      results: tours.length,
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
