import userModel from "../frameworks/models/user.model";
import IUser from "../entities/user";
import { IUserRepository } from "../interfaces/repository/user.repository";

class UserRepository implements IUserRepository {
  constructor() {}

  async createUser(data: IUser): Promise<IUser | null> {
    try {
      const user = await userModel.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(data: IUser): Promise<IUser | null> {
    try {
      const existingUser = await userModel.findById(data._id);
      if (!existingUser) {
        return this.createUser(data);
      }
      existingUser.name = data.name;
      existingUser.email = data.email;
      existingUser.role = data.role;

      const user = await existingUser.save();

      return existingUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
