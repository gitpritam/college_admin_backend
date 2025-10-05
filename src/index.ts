import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db.config";
import MainRouter from "./routes";
import CustomError from "./utils/CustomError";
import globalErrorHandler from "./middleware/globalErrorHandler.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://localhost:4173",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = { origin: ["http://localhost:5173"], credentials: true };
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api", MainRouter); //localhost:5000/api

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(
    404,
    `Can't find ${req.originalUrl} in this server`
  );
  next(err);
});

//global error handler
app.use(globalErrorHandler);

//DB Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server online: ${PORT}`));
