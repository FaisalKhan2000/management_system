import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { JWT_SECRET } from "../constants/env";

interface TokenPayload {
  userId: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const user = await UserModel.findById(decoded.userId).exec(); // Added exec() for better error handling

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authenticated" });
  }
};
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if the user's roles array contains any of the required roles
    if (!roles.some((role) => (req.user as any).roles.includes(role))) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
