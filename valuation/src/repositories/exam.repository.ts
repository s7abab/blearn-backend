import IExam from "../entities/exam";
import examModel from "../frameworks/models/exam.model";
import { IQuestion } from "../interfaces/exam.interface";

class ExamRepository {
  constructor() {}

  public async createExam(data: IExam) {
    try {
      console.log(data);
      const exam = await examModel.create({
        courseId: data.courseId,
        totalQuestions: data.totalQuestions,
        passMark: data.passMark,
      });
      return exam;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findByIdAndUpdatePassMark(courseId: string, passMark: number) {
    try {
      const exam = await examModel.findByIdAndUpdate(courseId, { passMark });
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async findExamByCourseId(courseId: string) {
    try {
      const exam = await examModel.findOne({ courseId });
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async createQuestion(courseId: string, data: IQuestion) {
    try {
      const exam = await examModel.findOne({ courseId });
      if (exam?.questions.length === 10) {
        throw new Error("Maximum number of questions reached");
      }
      exam?.questions.push(data);
      exam?.save();
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAnddeleteQuestion(courseId: string, index: number) {
    try {
      const exam = await examModel.findOne({ courseId });
      if (!exam) throw new Error("Exam not found");
      exam?.questions.splice(index, 1);
      await exam?.save();
      return exam;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndUpdateQuestion(
    courseId: string,
    index: number,
    data: IQuestion
  ) {
    try {
      const exam = await examModel.findOne({ courseId });
      if (!exam) throw new Error("Exam not found");
      exam.questions[index] = data;
      await exam.save();
      return exam;
    } catch (error) {
      throw error;
    }
  }
}

export default ExamRepository;
