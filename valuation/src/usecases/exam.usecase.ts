import IExam from "../entities/exam";
import { IQuestion } from "../interfaces/exam.interface";
import ExamRepository from "../repositories/exam.repository";

class ExamUsecase {
  private examRepository: ExamRepository;
  constructor(examRepository: ExamRepository) {
    this.examRepository = examRepository;
  }

  public async createExam(courseId: string) {
    try {
      const exam = await this.examRepository.createExam(courseId);
      if (!exam) throw new Error("Error creating exam");
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async getExam(courseId: string) {
    try {
      const exam = await this.examRepository.findExamByCourseId(courseId);
      if (!exam) throw new Error("Error in fetching exam");
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async createQuestion(_id: string, data: IQuestion) {
    try {
      const exam = await this.examRepository.createQuestion(_id, data);
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async deleteQuestion(courseId: string, index: number) {
    try {
      const exam = await this.examRepository.findByIdAnddeleteQuestion(
        courseId,
        index
      );
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async updateQuestion(
    courseId: string,
    index: number,
    data: IQuestion
  ) {
    try {
      const exam = await this.examRepository.findByIdAndUpdateQuestion(
        courseId,
        index,
        data
      );
      if (!exam) throw new Error("Error in updating question");
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async addCompletedUser(userId: string, courseId: string) {
    try {
      const exam = await this.examRepository.findExamAndAddCompletedUser(
        userId,
        courseId
      );
      if (!exam) throw new Error("Error in adding completed user");
      return exam;
    } catch (error) {
      throw error;
    }
  }
}

export default ExamUsecase;
