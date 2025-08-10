import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import CustomError from "../utils/CustomError";
import jwt from "jsonwebtoken";
import { IJWTPayload } from "../@types/interface/jwt/jwtPayload.interface";
import { rolesType } from "../@types/types/roles.type";

const JWT_SECRET = process.env.JWT_SECRET as string;

const authenticate = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //headers = authorization -> Bearer "token"
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new CustomError(401, "Unauthenticated: no token provided."));
    }

    //verify the token
    const payloadDecoded: IJWTPayload = jwt.verify(
      token,
      JWT_SECRET
    ) as IJWTPayload;

    req.user = payloadDecoded;

    next();
  }
);

const authorize = (authorizedRoles: rolesType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (userRole && authorizedRoles.includes(userRole)) {
      next();
    } else {
      return next(
        new CustomError(
          403,
          "Forbidden: You do not have permission to access this resource."
        )
      );
    }
  };
};

export { authenticate, authorize };
