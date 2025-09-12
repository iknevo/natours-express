import { User } from "@/modules/user/user.model";
import { catchHandler } from "@/utils/catch-handler";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const signup = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);
    res.status(status.CREATED).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  },
);
