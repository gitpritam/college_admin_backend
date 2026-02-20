import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db.config";
import MainRouter from "./routes";
import CustomError from "./utils/CustomError";
import globalErrorHandler from "./middleware/globalErrorHandler.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import helmet from "helmet";
import corsOptions from "./config/cors.config";
import { initSocket } from "./config/socket.config";
import { systemLogger } from "./config/log.config";
import limiter from "./config/ratelimit.config";
import mongoose from "mongoose";

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err.name, err.message);
  systemLogger.error("Uncaught Exception", {
    message: err.message,
    errorName: err.name,
  });

  // Safety timeout: force exit after 10 seconds
  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

const app = express();
const server = createServer(app);

app.use(helmet());

app.use(cors(corsOptions));

// Middleware
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", MainRouter); //localhost:5000/api

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(
    404,
    `Can't find ${req.originalUrl} in this server`,
  );
  next(err);
});

//global error handler
app.use(globalErrorHandler);

//DB Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server online: ${PORT}`);
  systemLogger.info(`Server online: ${PORT}`);
});

initSocket(server);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  process.env.NODE_ENV === "prod" &&
    systemLogger.error("Unhandled Rejection", {
      message: err.message,
      errorName: err.name,
    });
  server.close(() => {
    process.exit(1);
  });
});
