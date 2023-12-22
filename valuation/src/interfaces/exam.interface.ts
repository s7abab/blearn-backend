export interface IQuestion {
  question: string;
  optionA: string;
  optionC: string;
  optionB: string;
  optionD: string;
  correctAnswer: string;
}

export interface ICompletedUser {
  userId: string;
  completed: number;
}

