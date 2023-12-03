import { IEnroll } from "../../@types/modelTypes/course";
import userRepository from "../../repositories/user.repository";

export const createEnrollment = async ({ courseId, userId }: IEnroll) => {
  try {
    const enrollment = await userRepository.addCourseToUser(
      userId,
      courseId
    );
    return enrollment;
  } catch (error: any) {
    throw new Error(error);
  }
};
