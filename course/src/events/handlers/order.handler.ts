import { IEnroll } from "../../@types/modelTypes/course";
import enrollmentRepository from "../../repositories/enrollment.repository";

export const createEnrollment = async ({ courseId, userId }: IEnroll) => {
  try {
    const enrollment = await enrollmentRepository.addCourseToUser(
      userId,
      courseId
    );
    return enrollment;
  } catch (error: any) {
    throw new Error(error);
  }
};
