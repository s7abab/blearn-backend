import mongoose, { Schema } from "mongoose";
import Order from "../../entities/order";
import { PaymentStatus } from "../../enums/payment.enum";

const orderSchema: Schema<Order> = new Schema<Order>(
  {
    userId: { type: String, required: true },
    instructorId: {type:String, required:true},
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

const orderModel = mongoose.model<Order>("Order", orderSchema);

export default orderModel;
