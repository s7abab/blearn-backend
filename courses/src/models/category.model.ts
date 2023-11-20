import mongoose, { Schema, Types } from "mongoose";
import { ICategory } from "../../@types/modelTypes/model.types";

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    isListed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model<ICategory>("Category", categorySchema);

export default categoryModel;
