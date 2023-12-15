import { Course } from "../entities/course";
import courseModel from "../frameworks/models/course.model";
import { IEnroll, IEnrolledUser } from "../interfaces/enrollment.interface";
import {
  ILesson,
  ILessonProgressTrackData,
  ILessonRequest,
} from "../interfaces/lesson.interface";
import {
  IModule,
  IModuleDeleteRequest,
  IModuleRequest,
} from "../interfaces/module.interface";
import ICourseRepository from "../interfaces/repository/course.repository";

class CourseRepository implements ICourseRepository {
  constructor() {}

  // course
  async create(data: Course): Promise<Course | null> {
    try {
      const course = await courseModel.create(data);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseIdAndUpdate(data: Course): Promise<Course | null> {
    try {
      const { _id, ...updateData } = data;
      const course = await courseModel.findByIdAndUpdate(_id, updateData, {
        new: true,
      });
      return course;
    } catch (error) {
      throw error;
    }
  }

  async find(page:number, limit:number): Promise<Course[]> {
    try {
      const courses = await courseModel.find().skip((page - 1) * limit)
      .limit(limit);
      return courses;
    } catch (error) {
      throw error;
    }
  }
  async findByCourseId(courseId: string): Promise<Course | null> {
    try {
      const course = await courseModel.findById(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseIdAndDelete(courseId: string): Promise<Course | null> {
    try {
      const course = await courseModel.findByIdAndDelete(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findByInstructorId(instructorId: string): Promise<Course[] | null> {
    try {
      const courses = await courseModel.find({
        instructorId: instructorId,
      });
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async findByInstructorIdAndCourseId(
    instructorId: string,
    courseId: string
  ): Promise<Course | null> {
    try {
      const course = await courseModel.findOne({
        _id: courseId,
        instructorId: instructorId,
      });
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findEnrolledCoursesByUserId(userId: string): Promise<Course[] | null> {
    try {
      const enrolledCourses = await courseModel.find({
        "enrolledUsers.userId": userId,
      });
      return enrolledCourses;
    } catch (error) {
      throw error;
    }
  }

  async findEnrolledCourseByUserAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Course | null> {
    try {
      // Find the enrolled course for the specific user and course
      const enrolledCourse = await courseModel.findOne({
        _id: courseId,
        "enrolledUsers.userId": userId,
      });
      return enrolledCourse;
    } catch (error) {
      throw error;
    }
  }

  // module
  async createModule(data: IModule) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const module = course?.modules?.push(data);
      await course.save();

      return module;
    } catch (error) {
      throw error;
    }
  }

  async findModules(courseId: string) {
    try {
      const course = await this.findByCourseId(courseId);
      const modules = course?.modules;

      return modules;
    } catch (error) {
      throw error;
    }
  }

  async findModuleAndUpdate(data: IModuleRequest) {
    try {
      const course = await courseModel.findOne({
        _id: data.courseId,
        instructorId: data.instructorId,
      });
      if (course && course.modules) {
        const moduleToUpdate = course.modules[data.index];
        moduleToUpdate.title = data.title;
        await course.save();

        return moduleToUpdate;
      }
    } catch (error) {
      throw error;
    }
  }

  async findModuleAndDelete(data: IModuleDeleteRequest) {
    const course = await courseModel.findOne({
      _id: data.courseId,
      instructorId: data.instructorId,
    });
    if (!course) {
      throw new Error("Course not found");
    }
    if (course.modules) {
      const moduleTodelete = course.modules.splice(data.index, 1);
      await course.save();
      return moduleTodelete;
    }
  }

  // lesson
  async createLesson(data: ILessonRequest) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const totalLessons = (course.totalLessons = course.totalLessons + 1);
      let lesson = null;
      if (course.modules) {
        lesson = course?.modules[data.index].lessons.push({
          title: data.title,
          duration: data.duration,
          type: data.type,
          url: data.url,
          lessonNo: totalLessons,
        } as ILesson);
        if (data.type === "video") {
          course.duration += data.duration!;
        }
        await course.save();
      }
      return lesson;
    } catch (error) {
      throw error;
    }
  }

  async createEnroll(data: IEnroll) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      course.enrolledUsers.push({
        userId: data.userId,
        progress: 0,
      } as IEnrolledUser);
      await course.save();
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findLessonAndTrackProgression(data: ILessonProgressTrackData) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const user = course.enrolledUsers.find((user) => user.userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.completedLessons.includes(data.lessonId)) {
        return true;
      }
      user.completedLessons.push(data.lessonId);
      user.progress = user?.progress + data.progress;
      await course.save();
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  async findProgressionByUserIdAndCourseId (userId:string, courseId:string) {
    const course = await this.findEnrolledCourseByUserAndCourseId(userId, courseId);
    const totalDuration = course?.duration;
    const completedDuration = course?.enrolledUsers.find((user) => user.userId === userId)?.progress;
    const progression = Math.floor((completedDuration! / totalDuration!) * 100)
    return progression
  }
}

export default CourseRepository;
