import { Request, Response } from "express";

const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export default logout;
