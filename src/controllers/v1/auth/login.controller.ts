import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import FacultyModel from "../../../models/faculty.model";
import comparePassword from "../../../utils/password/comparePassword";
import generateAuthToken from "../../../utils/jwt/generateAuthToken";
import { activityLogger } from "../../../config/log.config";

//signin
const login = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      activityLogger.warn("Login Failed", {
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Email and password are required",
      });
      return next(new CustomError(400, "Email and password are required"));
    }

    //find the user
    const user = await FacultyModel.findOne({ email });
    if (!user) {
      activityLogger.warn("Login Failed", {
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Wrong credentials for email ${email}`,
      });
      return next(new CustomError(401, "Wrong credentials"));
    }

    //check password
    let isPasswordvalid = false;
    if (user.password)
      isPasswordvalid = await comparePassword(password, user.password);
    if (!isPasswordvalid) {
      activityLogger.warn("Login Failed", {
        user_id: user._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Wrong credentials",
      });
      return next(new CustomError(401, "Wrong credentials"));
    }
    if (!user.account_status) {
      activityLogger.warn("Login Failed", {
        user_id: user._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Account disabled",
      });
      return next(
        new CustomError(401, "Account disabled! Please contact authority."),
      );
    }

    const payload = {
      _id: user._id,
      faculty_id: user.faculty_id,
      role: user.role,
    };

    const jwtExpiry = process.env.JWT_EXPIRY || "30";

    const token = generateAuthToken(payload, parseInt(jwtExpiry, 10));
    //csrf attack
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax", //strict, lax, none
      maxAge: parseInt(jwtExpiry) * 24 * 60 * 60 * 1000, // 30 days // ms
    });

    // Convert to plain object and remove password
    const userObject = user.toObject();
    delete userObject.password;

    activityLogger.info("Login Successful", {
      user_id: user._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `User ${user.faculty_id} logged in successfully`,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      result: {
        token,
        user: userObject,
      },
    });
  },
);

export default login;
