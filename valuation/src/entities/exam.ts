import { ICompletedUser, IQuestion } from "../interfaces/exam.interface";

interface IExam {
  _id: any;
  courseId: string;
  questions: IQuestion[];
  completedUsers: ICompletedUser[];
  totalQuestions: number;
  passMark: number;
}

export default IExam;
