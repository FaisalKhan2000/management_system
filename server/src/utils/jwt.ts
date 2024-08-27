import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";
import { JWT_EXPIRY, JWT_SECRET } from "../constants/env";

export type tokenType = {
  userId: UserDocument["_id"];
};

export const signToken = (payload: tokenType) => {
  const { userId } = payload;

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};
