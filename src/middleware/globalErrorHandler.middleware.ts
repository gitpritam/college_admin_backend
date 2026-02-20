import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose"; // Mongoose-specific errors
import CustomError from "../utils/CustomError";
import { activityLogger } from "../config/log.config";
// import logger from "@/utils/logger"; // Logging utility (Winston or other logger)

// Utility function for sending responses
const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details?: any,
) => {
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...((process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "local") &&
      details && { details }),
  });
};

// Specific error handlers
const handleCastError = (err: MongooseError.CastError): CustomError =>
  new CustomError(400, `Invalid value for ${err.path}: ${err.value}`);

const handleValidationError = (
  err: MongooseError.ValidationError,
): CustomError => {
  const messages = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  return new CustomError(400, `Validation error: ${messages}`);
};

const handleDuplicateKeyError = (err: any): CustomError =>
  new CustomError(
    400,
    `Duplicate key error: ${Object.keys(err.keyValue).join(", ")}`,
  );

// **Global Error Handling Middleware**
const globalErrorHandler = (
  err: CustomError | any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "local") {
    sendError(res, err.statusCode, err.message, {
      stack: err.stack,
      error: err,
    });
  } else {
    let error: CustomError =
      err instanceof CustomError
        ? err
        : new CustomError(
            err.statusCode || 500,
            err.message || "Something went wrong",
          );

    //mongodb
    if (err.name === "CastError") error = handleCastError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.code === 11000) error = handleDuplicateKeyError(err);

    //log
    activityLogger.error(err.message, {
      user_id: req.user?._id,
      http_method: req.method,
      endpoint: req.path,
      stack: err.stack,
    });

    sendError(res, error.statusCode || 500, error.message);
  }
};

export default globalErrorHandler;
