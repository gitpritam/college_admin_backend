import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import { Error as MongooseError } from "mongoose";

const globalErrorHandler = (
  err: CustomError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  //logger setup

  // Specific error handlers
  const handleCastError = (err: MongooseError.CastError): CustomError =>
    new CustomError(400, `Invalid value for ${err.path}: ${err.value}`);

  const handleValidationError = (
    err: MongooseError.ValidationError
  ): CustomError => {
    const messages = Object.values(err.errors)
      .map((el) => el.message)
      .join(". ");
    return new CustomError(400, `Validation error: ${messages}`);
  };

  const handleDuplicateKeyError = (err: any): CustomError =>
    new CustomError(
      400,
      `Duplicate key error: ${Object.keys(err.keyValue).join(", ")}`
    );

  if (process.env.NODE_ENV === "local" || process.env.NODE_ENV === "dev") {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message || "An error occurred",
      details: { stackTrace: err.stack, err },
    });
  } else {
    // production
    let error = { ...err, message: err.message };

    if (err.name === "CastError") error = handleCastError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.code === 11000) error = handleDuplicateKeyError(err); //mongodb duplicate key error

    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message || "An error occurred",
    });
  }
};

export default globalErrorHandler;
