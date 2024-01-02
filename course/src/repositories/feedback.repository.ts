import IFeedback from "../entities/Feedback";
import courseModel from "../frameworks/models/course.model";
import feedbackModel from "../frameworks/models/feedback.model";
import { IFeedbackRepository } from "../interfaces/repository/feedback.repository";

class FeedbackRepository implements IFeedbackRepository {
  constructor() {}

  public async createFeedback(data: IFeedback): Promise<IFeedback | null> {
    try {
      const feedback = await feedbackModel.create(data);

      // Find the course by its ID
      const course = await courseModel.findById(data.courseId);

      if (course) {
        // Update the course rating count and average
        course.rating.count = (course.rating.count || 0) + 1;
        const newTotalRating =
          (course.rating.average || 0) * (course.rating.count - 1) +
          data.rating;
        course.rating.average = newTotalRating / course.rating.count;

        // Save the updated course
        await course.save();
      }
      await feedback.save();
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  public async findFeedbacksByCourseId(
    courseId: string
  ): Promise<IFeedback[] | null> {
    try {
      const feedbacks = await feedbackModel
        .find({ courseId })
        .populate("userId");

      return feedbacks;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default FeedbackRepository;
