import ICourse from "../entities/course";
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
  public async create(data: ICourse): Promise<ICourse | null> {
    try {
      const course = await courseModel.create(data);
      return course;
    } catch (error) {
      throw error;
    }
  }

  public async findByCourseIdAndUpdate(data: ICourse): Promise<ICourse | null> {
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

  public async findCourses(): Promise<ICourse[]> {
    try {
      const courses = await courseModel.find();
      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async searchCourses(
    filters: ICourseFilters
  ): Promise<{ courses: ICourse[]; totalPages: number }> {
    try {
      const limit = 8;
      let query = courseModel.find();
      // Apply search if search keyword is provided
      if (filters.searchKeyword) {
        query = courseModel.find({
          $or: [
            { title: { $regex: new RegExp(filters.searchKeyword, "i") } }, // Case-insensitive search on the title field
            { description: { $regex: new RegExp(filters.searchKeyword, "i") } }, // Case-insensitive search on the description field
          ],
        });
      }

      // Apply price sorting if provided
      if (filters.priceFilter === "low") {
        query = query.sort({ price: 1 }); // Sort by price in ascending order
      } else if (filters.priceFilter === "high") {
        query = query.sort({ price: -1 });
      }

      // Apply sorting by most enrolled
      if (filters.sortByEnrollments) {
        query = query.sort({ enrollments: -1 });
      }
      // Filter courses where totalLessons is greater than 5
      query = query.find({ totalLessons: { $gt: 4 } });

      const courses = await query.skip((filters.page - 1) * limit).limit(limit);
      const totalCoursesCount = await courseModel.countDocuments();

      const totalPages = Math.ceil(totalCoursesCount / limit);

      const data = { courses, totalPages };
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async findByCourseId(courseId: string): Promise<ICourse | null> {
    try {
      const course = await courseModel.findById(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  public async findByCourseIdAndDelete(
    courseId: string
  ): Promise<ICourse | null> {
    try {
      const course = await courseModel.findByIdAndDelete(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  public async findByInstructorId(
    instructorId: string
  ): Promise<ICourse[] | null> {
    try {
      const courses = await courseModel.find({
        instructorId: instructorId,
      });
      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async findByInstructorIdAndCourseId(
    instructorId: string,
    courseId: string
  ): Promise<ICourse | null> {
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

  public async findEnrolledCoursesByUserId(
    userId: string
  ): Promise<ICourse[] | null> {
    try {
      const enrolledCourses = await courseModel.find({
        "enrolledUsers.userId": userId,
      });
      return enrolledCourses;
    } catch (error) {
      throw error;
    }
  }

  public async findEnrolledCourseByUserAndCourseId(
    userId: string,
    courseId: string
  ): Promise<ICourse | null> {
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
  public async createModule(data: IModule) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("ICourse not found");
      }
      const module = course?.modules?.push(data);
      await course.save();

      return module;
    } catch (error) {
      throw error;
    }
  }

  public async findModules(courseId: string) {
    try {
      const course = await this.findByCourseId(courseId);
      const modules = course?.modules;

      return modules;
    } catch (error) {
      throw error;
    }
  }

  public async findModuleAndUpdate(data: IModuleRequest) {
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

  public async findModuleAndDelete(data: IModuleDeleteRequest) {
    const course = await courseModel.findOne({
      _id: data.courseId,
      instructorId: data.instructorId,
    });
    if (!course) {
      throw new Error("ICourse not found");
    }
    if (course.modules) {
      const moduleTodelete = course.modules.splice(data.index, 1);
      await course.save();
      return moduleTodelete;
    }
  }

  // lesson
  public async createLesson(data: ILessonRequest) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("ICourse not found");
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

  public async findLessonsAndUpdate(data: ILessonRequest) {
    try {
      const course = await courseModel.findById(data.courseId);

      if (!course) {
        throw new Error("Course not found");
      }

      const moduleIndex = data.index;
      const lessonIndex = data.lessonIndex;

      // Update the lesson with new data
      course.modules[moduleIndex].lessons[lessonIndex].title = data.title;
      course.modules[moduleIndex].lessons[lessonIndex].duration = data.duration;
      course.modules[moduleIndex].lessons[lessonIndex].type = data.type;
      course.modules[moduleIndex].lessons[lessonIndex].url = data.url;

      if (data.type === "video") {
        // Add the difference in duration between the new and old values
        const oldDuration =
          course.modules[moduleIndex].lessons[lessonIndex].duration || 0;
        course.duration += data.duration - oldDuration;
      }

      await course.save();
      return course;
    } catch (error) {
      throw error;
    }
  }

  public async createEnroll(data: IEnroll) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("ICourse not found");
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

  public async findLessonAndTrackProgression(data: ILessonProgressTrackData) {
    try {
      const course = await courseModel.findById(data.courseId);
      if (!course) {
        throw new Error("ICourse not found");
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

  public async findProgressionByUserIdAndCourseId(
    userId: string,
    courseId: string
  ) {
    const course = await this.findEnrolledCourseByUserAndCourseId(
      userId,
      courseId
    );
    const totalDuration = course?.duration;
    const completedDuration = course?.enrolledUsers.find(
      (user) => user.userId === userId
    )?.progress;
    const progression = Math.floor((completedDuration! / totalDuration!) * 100);
    return progression;
  }
}

export default CourseRepository;
