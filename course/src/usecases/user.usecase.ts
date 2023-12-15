import IUser from "../entities/user";
import UserRepository from "../repositories/user.repository";

class UserUsecase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async createUser(data: IUser): Promise<IUser | Error> {
    const user = await this.userRepository.createUser(data);
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  }

  public async updateUser(data: IUser): Promise<IUser | Error> {
    console.log(data.updatedData)
    const user = await this.userRepository.updateUser(data.updatedData);
    if (!user) {
      throw new Error("Failed to update user");
    }
    return user;
  }
}

export default UserUsecase;
