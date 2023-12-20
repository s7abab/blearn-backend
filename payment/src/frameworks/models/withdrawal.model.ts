import mongoose, { Schema, Types } from "mongoose";
import IWithdrawal from "../../entities/withdrawal";

const withdrawalSchema: Schema<IWithdrawal> = new Schema<IWithdrawal>(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    date: { type: String, required: true },
    txid: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const withdrawalModel = mongoose.model<IWithdrawal>(
  "Withdrawal",
  withdrawalSchema
);

export default withdrawalModel;
