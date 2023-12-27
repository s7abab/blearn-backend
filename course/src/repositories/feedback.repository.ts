import IFeedback from "../entities/Feedback";
import feedbackModel from "../frameworks/models/feedback.model";
import { IFeedbackRepository } from "../interfaces/repository/feedback.repository";

class FeedbackRepository implements IFeedbackRepository {
  constructor() {}

  public async createFeedback(data: IFeedback): Promise<IFeedback | null> {
    try {
      const feedback = await feedbackModel.create(data);
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  public async findFeedbacksByCourseId(
    courseId: string
  ): Promise<IFeedback[] | null> {
    try {
      const feedbacks = await feedbackModel.find({ courseId }).populate("userId");
      return feedbacks;
    } catch (error) {
      throw error;
    }
  }
}

export default FeedbackRepository;
