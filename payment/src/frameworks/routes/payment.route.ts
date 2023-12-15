import express, { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "@s7abab/common";
import PaymentUsecase from "../../usecases/payment.usecase";
import PaymentController from "../../controllers/payment.controller";
import PaymentRepository from "../../repositories/payment.repository";
import StripeService from "../utils/stripeService";

const stripeService = new StripeService();
const paymentRespository = new PaymentRepository();
const paymentUsecase = new PaymentUsecase(paymentRespository, stripeService);
const paymentController = new PaymentController(paymentUsecase);
const router = express.Router();

router.get(
  "/stripepublishablekey",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.sendStripePublishableKey(req, res, next)
);

router.post(
  "/new-payment",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.newPayment(req, res, next)
);

router.post(
  "/create-order",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.createOrder(req, res, next)
);

export default router;
