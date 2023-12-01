import mongoose, { Schema } from "mongoose";
import { IEntroll } from "../@types/modelTypes/course";
import { PaymentStatus } from "../@types/enrollment.types";

const enrollmentSchema: Schema<IEntroll> = new Schema<IEntroll>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    price: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: [
        PaymentStatus.PENDING,
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
      ],
      required: true,
      default: PaymentStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const enrollmentModel = mongoose.model<IEntroll>("Enrollment", enrollmentSchema);

export default enrollmentModel;
