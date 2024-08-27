import jwt, { JwtPayload } from "jsonwebtoken";
import { CONFLICT, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { signToken } from "../utils/jwt";
import { JWT_SECRET } from "../constants/env";
import AppError from "../utils/appError";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const createAccount = async (data: CreateAccountParams) => {
  // verify existing user doesn't exists
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  // using assertion
  appAssert(!existingUser, CONFLICT, "Email already in use");

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  // sign Token
  // const token = signToken({ userId: user._id });

  return {
    user: user.omitPassword(),
    // token,
  };
};

export type LoginUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async (data: LoginUserParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email: data.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  // validate password from the request
  const isValid = await user.comparePassword(data.password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  // sign Token
  const token = signToken({ userId: user._id });

  return {
    user: user.omitPassword(),
    token,
  };
};

export type forgetPasswordParams = {
  email: string;
};
export const forgetPassword = async (data: forgetPasswordParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email: data.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  user.resetToken = resetToken;
  user.resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  return { email: user.email, resetToken };
};

export type resetPasswordParams = {
  email: string;
  password: string;
  token: string;
};
export const resetPassword = async (data: resetPasswordParams) => {
  // verify jwt
  const decoded = jwt.verify(data.token, JWT_SECRET) as JwtPayload;

  const { userId } = decoded;

  const user = await UserModel.findOne({
    _id: userId,
    resetToken: data.token,
    resetTokenExpiration: { $gt: new Date() },
  });

  // Handle case where user is not found
  if (!user) {
    throw new AppError(500, "Token is invalid or has expired");
  }

  // Update user password and clear reset token
  user.password = data.password;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  return {
    message: "Password has been reset",
  };
};
