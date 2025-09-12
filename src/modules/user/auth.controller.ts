import config from "@/config/config";
import { User } from "@/modules/user/user.model";
import { catchHandler } from "@/utils/catch-handler";
import { Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";

export const signup = catchHandler(async (req: Request, res: Response) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
  const token = jwt.sign({ id: newUser._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  res.cookie("jwt", token, {
    httpOnly: true, // prevents client-side JS from accessing the cookie
    secure: config.production, // only send over HTTPS in production
    sameSite: "strict", // helps prevent CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user: {
        token,
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
});
