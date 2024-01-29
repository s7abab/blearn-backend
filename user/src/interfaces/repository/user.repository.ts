import IUser from "../../entities/User";
import { IBankDetails } from "../user.interface";

interface IUserRepository {
  create(data: IUser): Promise<IUser | null>;
  findByRole(role: string): Promise<IUser[] | null>;
  findById(userId: string): Promise<IUser | null>;
  findUserAndDeleteFromRedis(userId: string): Promise<number>;
  findByIdAndRole(userId: string, role: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByIdAndBlock(userId: string): Promise<IUser | null>;
  findByEmailAndComparePassword(
    email: string,
    password: string
  ): Promise<boolean>;
  findByIdAndUpdate(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<IUser | null>;
  findByIdAndMakeInstructor(data: any): Promise<IUser | null>;
  findByIdAndUpdateAvatar(
    userId: string,
    imageUrl: string
  ): Promise<IUser | null>;
  findByIdAndUpdateBankDetails(
    userId: string,
    bankDetails: IBankDetails
  ): Promise<IUser | null>;
  findApplications(): Promise<IUser[] | null>;
  changeStatusOfApplication(
    userId: string,
    status: string
  ): Promise<IUser | null>;
  findUsersDataForAdminDashboard(): Promise<{
    usersData: { month: number; count: number }[];
    users: number;
    instructors: number;
  } | null>;
}

export default IUserRepository;
