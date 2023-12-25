require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import { ErrorMiddleware } from "@s7abab/common";
import courseRoute from "../routes/course.route";
import categoryRoute from "../routes/category.route";
// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// morgan for logging in console
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/course/category", categoryRoute);

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found`) as any;
  error.statusCode = 404;
  next(error);
});

// error middleware
app.use(ErrorMiddleware);
