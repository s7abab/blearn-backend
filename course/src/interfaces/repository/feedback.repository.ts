import IFeedback from "../../entities/Feedback";

export interface IFeedbackRepository {
  createFeedback: (data: IFeedback) => Promise<IFeedback | null>;
  findFeedbacksByCourseId: (courseId: string) => Promise<IFeedback[] | null>;
}
