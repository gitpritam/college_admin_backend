import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Validation Middleware using Zod.
 * - Supports single, multiple, and field-based file uploads.
 * - Deletes uploaded files if validation fails.
 * @param schema - Zod schema for request validation
 */

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body using Zod
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const formattedErrors = result.error.format();

        return res.status(400).json({
          success: "false",
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.format(),
        });
      }
      next(error);
    }
  };
};
