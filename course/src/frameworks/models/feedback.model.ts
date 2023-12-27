import { Schema, model } from "mongoose";
import IFeedback from "../../entities/Feedback";

const feedbackSchema = new Schema<IFeedback>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const feedbackModel = model<IFeedback>("Feedback", feedbackSchema);

export default feedbackModel;
