require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "@s7abab/common";
import paymentRouter from "../routes/payment.route";
import analyticsRouter from "../routes/analytics.route";
import withdrawalRouter from "../routes/withdrawal.route";

// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());

app.use(cors({
  origin: 'https://blearn-azure.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// morgan for logging in console
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/payment/analytics", analyticsRouter);
app.use("/api/v1/payment/withdrawals", withdrawalRouter);

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found`) as any;
  error.statusCode = 404;
  next(error);
});

// error middleware
app.use(ErrorMiddleware);
