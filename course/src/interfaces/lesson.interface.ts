export interface ILesson {
  _id: any;
  type: string;
  title: string;
  url: string;
  lessonNo: number;
  progress: number;
  duration: number;
}

export interface ILessonRequest extends ILesson {
  courseId: string;
  index: number;
  lessonIndex:number
}

export interface ILessonGetRequest {
  courseId: string;
  instructorId: string;
  index: any;
}

export interface ILessonProgressTrackData {
  courseId: string;
  lessonId:string;
  userId: string;
  progress: number;
}
