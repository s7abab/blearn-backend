import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import paymentRepository from "../repositories/payment.repository";
import { Payment } from "../events/subjects";
import { publishEvent } from "../events/publisher";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface IOrder {
  courseId: string;
  payment_info: {
    amount: number;
    status: string;
  };
}
export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized!", 400));
          }
        }
      }
      const price = payment_info.amount / 100;
      const userId = req?.user?.id;

      await paymentRepository.createOrder({
        courseId: courseId,
        userId: userId,
        price: price,
        payment_status: payment_info.status,
      });
      // publish order created event
      const payload = {
        subject: Payment.ORDER_CREATED,
        courseId,
        userId,
      };
      publishEvent({
        payload,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const sendStripePublishableKey = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const newPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount * 100,
        currency: "INR",
        metadata: {
          company: "B-Learn",
        },
        description: "Description of the export transaction",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
