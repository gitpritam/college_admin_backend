import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import FacultyModel from "../../../models/faculty.model";
import comparePassword from "../../../utils/password/comparePassword";
import generateAuthToken from "../../../utils/jwt/generateAuthToken";

//signin
const login = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      return next(new CustomError(400, "Email and password are required"));
    }

    //find the user
    const user = await FacultyModel.findOne({ email });
    if (!user) {
      return next(new CustomError(401, "Wrong credentials"));
    }

    //check password
    let isPasswordvalid = false;
    if (user.password)
      isPasswordvalid = await comparePassword(password, user.password);
    if (!isPasswordvalid) {
      return next(new CustomError(401, "Wrong credentials"));
    }
    if (!user.account_status) {
      return next(
        new CustomError(401, "Account disabled! Please contact authority.")
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
      sameSite: "strict",
      maxAge: parseInt(jwtExpiry) * 24 * 60 * 60 * 1000, // 30 days // ms
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      result: {
        token,
      },
    });
  }
);

export default login;
