import mongoose, { Schema, Types } from "mongoose";
import { ICategory } from "../../@types/modelTypes/course";

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    name: { type: String,unique:true, required: true },
    isListed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model<ICategory>("Category", categorySchema);

export default categoryModel;
