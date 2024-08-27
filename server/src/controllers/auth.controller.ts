import { COOKIE_EXPIRY, JWT_EXPIRY, NODE_ENV } from "../constants/env";
import { CREATED, OK } from "../constants/http";
import {
  createAccount,
  forgetPassword,
  loginUser,
  resetPassword,
} from "../services/auth.services";
import catchErrors from "../utils/catchErrors";
import { sendResetPasswordEmail } from "../utils/mail";
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schemas";

export const registerHandler = catchErrors(async (req, res, next) => {
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { user } = await createAccount(request);

  // return response
  return res.status(CREATED).json({
    user,
    userAgent: request.userAgent,
  });
});

export const loginHandler = catchErrors(async (req, res, next) => {
  // validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { user, token } = await loginUser(request);

  // return response
  return res
    .cookie("token", token, {
      maxAge: COOKIE_EXPIRY,
      httpOnly: NODE_ENV === "production",
    })
    .status(OK)
    .json({
      user,
      userAgent: request.userAgent,
    });
});

export const logoutHandler = catchErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.status(OK).json({ message: "Logged out" });
});

export const forgetPasswordHandler = catchErrors(async (req, res, next) => {
  // validate request
  const request = forgetPasswordSchema.parse({
    ...req.body,
  });

  // call service
  const { email, resetToken } = await forgetPassword(request);

  // send email
  await sendResetPasswordEmail(email, resetToken);

  // return response
  return res.status(OK).json({
    message: "Password reset email sent",
  });
});

export const resetPasswordHandler = catchErrors(async (req, res, next) => {
  const token = req.params.token;
  // validate request
  const request = resetPasswordSchema.parse({
    ...req.body,
    token,
  });

  // call service
  const { message } = await resetPassword(request);

  // return response
  return res.status(OK).json({
    message,
  });
});
