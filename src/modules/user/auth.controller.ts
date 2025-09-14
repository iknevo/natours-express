import config from "@/config/config";
import { User, UserDocument } from "@/modules/user/user.model";
import { AppError } from "@/utils/app-error";
import { catchHandler } from "@/utils/catch-handler";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  iat: number;
}
declare module "express" {
  interface Request {
    user?: UserDocument;
  }
}

function generateAccessToken(id: any) {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
}

function generateRefreshToken(id: any) {
  return jwt.sign({ id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

function sendTokens(res: Response, id: any) {
  const accessToken = generateAccessToken(id);
  const refreshToken = generateRefreshToken(id);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.production,
    sameSite: "strict",
    maxAge: config.cookiesMaxAge,
  });
  return accessToken;
}

export const signup = catchHandler(async (req: Request, res: Response) => {
  // todo: remove password changed at that was for testing
  const { name, email, password, passwordConfirm, passwordChangedAt } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  });
  const accessToken = sendTokens(res, newUser._id);
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user: {
        accessToken,
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        passwordChangedAt: newUser.passwordChangedAt,
      },
    },
  });
});

export const login = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new AppError("Please Provide email and password", status.BAD_REQUEST),
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError("Invalid email or password", status.UNAUTHORIZED),
      );
    }
    const accessToken = sendTokens(res, user._id);
    res.status(status.OK).json({
      status: "success",
      user,
      accessToken,
    });
  },
);

export const refresh = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;
    if (!token) {
      return next(new AppError("No Refresh Token", status.UNAUTHORIZED));
    }
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as {
      id: string;
    };
    const accessToken = generateAccessToken(decoded.id);
    res.json({
      accessToken,
    });
  },
);

export const logout = catchHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken").json({ message: "Logged out successfully" });
});

export const protect = catchHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new AppError("No Token Provided", status.UNAUTHORIZED));
    }
    const accessToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      accessToken,
      config.jwt.secret,
    ) as CustomJwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User Not Found", status.UNAUTHORIZED));
    }
    if (user.changedPassowrdAfter(decoded.iat)) {
      return next(
        new AppError(
          "Password changed recently. Please log in again.",
          status.UNAUTHORIZED,
        ),
      );
    }
    req.user = user;
    next();
  },
);
