import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { IOrderRequest } from "../interfaces/order.interface";
import PaymentUsecase from "../usecases/payment.usecase";

class PaymentController {
  private paymentUsecase: PaymentUsecase;
  constructor(paymentUsecase: PaymentUsecase) {
    this.paymentUsecase = paymentUsecase;
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id;
      const { courseId, payment_info } = req.body as IOrderRequest;

      await this.paymentUsecase.createOrder({ courseId, payment_info }, userId);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message as Error.message , error.statusCode || 500));
    }
  }

  sendStripePublishableKey = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  };

  async newPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const client_secret = await this.paymentUsecase.newPayment(req.body.amount);

      res.status(201).json({
        success: true,
        client_secret: client_secret,
      });
    } catch (error: any) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default PaymentController;
