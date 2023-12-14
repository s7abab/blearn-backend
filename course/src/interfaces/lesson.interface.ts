export interface ILesson {
  type: string;
  title: string;
  url: string;
  lessonNo: number;
  progress: number;
  duration?: number;
}

export interface ILessonRequest extends ILesson {
  courseId: string;
  index: number;
}

export interface ILessonGetRequest {
  courseId: string;
  instructorId: string;
  index: any;
}

export interface ILessonProgressTrackData {
  courseId: string;
  moduleId: string | undefined;
  lessonId: string | undefined;
  progress: number;
}
