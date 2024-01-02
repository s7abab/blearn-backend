export interface ILesson {
  _id: any;
  type: string;
  title: string;
  url: string;
  progress: number;
  duration: number;
  totalLessons: number;
}

export interface ILessonRequest extends ILesson {
  courseId: string;
  moduleId: string;
  lessonIndex: number;
}

export interface ILessonGetRequest {
  courseId: string;
  instructorId: string;
  index: any;
}

export interface ILessonProgressTrackData {
  courseId: string;
  lessonId: string;
  userId: string;
  progress: number;
}
