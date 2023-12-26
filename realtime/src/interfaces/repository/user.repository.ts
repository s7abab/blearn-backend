import IUser from "../../entities/user";

export interface IUserRepository {
  createUser: (data:IUser) => Promise<IUser | null>;
  updateUser: (data:IUser) => Promise<IUser | null>;
}
