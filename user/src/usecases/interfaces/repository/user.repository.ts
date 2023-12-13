import IUser from "../../../entities/User";


interface IUserRepository {
  create(data: IUser): Promise<IUser | null>;
  findByRole(role: string): Promise<IUser[] | null>;
  findById(userId: string): Promise<IUser | null>;
  findByIdAndRole(userId: string, role: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}

export default IUserRepository;
