require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import userRouter from "../routes/user.route";
import { ErrorMiddleware } from "@s7abab/common";

// Security Middleware
app.use(helmet());

// Rate Limiting Middleware Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window for tracking requests
  max: 100, // Allow up to 100 requests per IP within the window
});

app.use(limiter);

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

app.use(
  cors({
    origin: "https://blearn-azure.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// morgan for logging in console
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/user", userRouter);
// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found`) as any;
  error.statusCode = 404;
  next(error);
});


// error middleware
app.use(ErrorMiddleware);
