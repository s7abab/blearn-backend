import IFeedback from "../entities/Feedback";
import FeedbackRepository from "../repositories/feedback.repository";

class FeedbackUsecase {
  private feedbackRepository: FeedbackRepository;
  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  public async createFeedback(data: IFeedback) {
    try {
      const feedback = await this.feedbackRepository.createFeedback(data);
      if (!feedback) throw new Error("Error creating feedback");
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  public async findFeedbacksByCourseId(courseId: string) {
    try {
      const feedbacks = await this.feedbackRepository.findFeedbacksByCourseId(
        courseId
      );

      if (!feedbacks) throw new Error("Error getting feedbacks");
      return feedbacks;
    } catch (error) {
      throw error;
    }
  }
}

export default FeedbackUsecase;
