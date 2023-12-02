import express from "express";
import {
  createOrder,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/payment.controller";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.get("/stripepublishablekey", sendStripePublishableKey);

router.post("/new-payment",isAuthenticated, newPayment);

router.post("/create-order", isAuthenticated, createOrder);

export default router;
