import mongoose, { Schema } from "mongoose";
import { ICourse, IReview } from "../../@types/modelTypes/model.types";

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating:{type:Number, default:0},
  comment: String,
});

const courseSchema: Schema<ICourse> = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    demoUrl: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    tags: { type: String },
    entrolls: { type: String },
    revenue: { type: String },
    isBlock: { type: Boolean, required: true, default: false },
    level: { type: String, default: "0" },
    coupon: [{ type: Schema.Types.ObjectId }],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model<ICourse>("Course", courseSchema);

export default courseModel;
