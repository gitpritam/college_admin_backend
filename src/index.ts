import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.config";
import MainRouter from "./routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "*", credentials: true }));
// app.use(cookieParser());

app.use("/api", MainRouter);

//DB Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server online: ${PORT}`));
