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
import { Server } from "socket.io";
import corsOptions from "./config/cors.config";
import { initSocket } from "./config/socket.config";

const app = express();
const server = createServer(app);

app.use(cors(corsOptions));

// Middleware
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
server.listen(PORT, () => console.log(`Server online: ${PORT}`));

initSocket(server);
