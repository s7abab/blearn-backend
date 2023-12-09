import mongoose, { Schema } from "mongoose";
import { IOrder, PaymentStatus } from "../@types/order.types";

const orderSchema: Schema<IOrder> = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    price: { type: Number, required: true },
    payment_status: {
      type: String,
      required: true,
      default: PaymentStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel;
