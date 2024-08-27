import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/appError";

const handleZodError = (res: Response, error: z.ZodError) => {
  // const errors = error.issues.map((err) => ({
  //   path: err.path.join("."),
  //   message: err.message,
  // }));

  const errorMessages = error.errors.map((err) => err.message).join(", ");

  return res.status(BAD_REQUEST).json({
    // message: error.message,
    // errors,
    message: errorMessages,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
  });
};

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
