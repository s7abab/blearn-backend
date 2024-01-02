import UserRepository from "../repositories/user.repository";

class userUsecase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async getEnrolledUsers(courseId: string) {
    try {
      const users = await this.userRepository.findEnrolledUsers(courseId);

      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default userUsecase;
