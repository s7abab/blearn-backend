import userModel from "../frameworks/models/user.model";
import IUser from "../entities/user";
import { IUserRepository } from "../interfaces/repository/user.repository";
import courseModel from "../frameworks/models/course.model";

class UserRepository implements IUserRepository {
  constructor() {}

  public async createUser(data: IUser): Promise<IUser | null> {
    try {
      const user = await userModel.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(data: IUser): Promise<IUser | null> {
    try {
      const existingUser = await userModel.findById(data._id);
      if (!existingUser) {
        return this.createUser(data);
      }
      existingUser.name = data.name;
      existingUser.email = data.email;
      existingUser.role = data.role;
      existingUser.avatar = data.avatar;
      const user = await existingUser.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findEnrolledUsers(courseId: string) {
    try {
      const course = await courseModel
        .findById(courseId)
        .select("enrolledUsers")
        .exec();
      if (!course) throw new Error("Course not found");

      // Extracting userIds using the map function
      const userIds = course.enrolledUsers.map((user) => user.userId);

      const users = await userModel.find({ _id: { $in: userIds } });
   
      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
