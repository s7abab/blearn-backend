import mongoose, { Schema } from "mongoose";
import IExam from "../../entities/exam";

const examSchema: Schema<IExam> = new Schema<IExam>(
  {
    courseId: { type: String, required: true },
    questions: { type: [{}], default: [] },
    completedUsers: { type: [{}], default: [] },
    totalQuestions: { type: Number, required: true },
    passMark: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const examModel = mongoose.model<IExam>("exam", examSchema);

export default examModel;
