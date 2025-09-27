import config from "@/config/config";
import { User, UserDocument } from "@/modules/user/user.model";
import { AppError } from "@/utils/app-error";
import { catchHandler } from "@/utils/catch-handler";
import { sendEmail } from "@/utils/email";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createHash } from "node:crypto";

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
    expires: config.cookiesExpires,
  });
  return accessToken;
}

export const signup = catchHandler(async (req: Request, res: Response) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  const accessToken = sendTokens(res, newUser._id);
  res.status(status.CREATED).json({
    status: "success",
    accessToken,
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
    if (user.changedPasswordAfter(decoded.iat)) {
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

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have permission to perform this action",
          status.FORBIDDEN,
        ),
      );
    }
    next();
  };
};

export const forgotPassword = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError("No user found for this email!", status.NOT_FOUND),
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.host}/api/users/reset-password/${resetToken}`;
    const message = `Forgot your password? submit a PATCH request with you new password and passwordConfirm to ${resetUrl}.\nIf you didn't forget your password please ignore this email`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message,
      });
      res.status(status.OK).json({
        status: "success",
        message: "Token sent to email.",
      });
    } catch (err) {
      console.log(err);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          "There was an error sending email, Try again later.",
          status.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  },
);

export const resetPassword = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new AppError("Token is invalid or has expired.", status.BAD_REQUEST),
      );
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const accessToken = sendTokens(res, user._id);
    res.status(status.OK).json({
      status: "success",
      accessToken,
    });
  },
);

export const updatePassword = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user as UserDocument;
    const { password, passwordConfirm, passwordCurrent } = req.body;
    const user = await User.findById(id).select("+password");
    if (
      !user ||
      !(await user.correctPassword(passwordCurrent, user.password))
    ) {
      return next(
        new AppError("You current password is wrong!", status.UNAUTHORIZED),
      );
    }
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    const accessToken = sendTokens(res, id);
    res.status(status.OK).json({
      status: "success",
      accessToken,
    });
  },
);
