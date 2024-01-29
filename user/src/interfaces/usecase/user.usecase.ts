import IUser from "../../entities/User";
import {
  IActivationRequest,
  IBankDetails,
  ILoginRequest,
  IRegisterUser,
} from "../user.interface";

interface IUserUsecase {
  register(userData: IRegisterUser): Promise<string>;
  activateUser(data: IActivationRequest): Promise<void>;
  socialAuth(data: IUser): Promise<any>;
  login(data: ILoginRequest): Promise<any>;
  compareUserPassword(email: string, password: string): Promise<boolean>;
  getUsersByRole(role: string): Promise<IUser[] | null>;
  getOneUser(userId: string): Promise<IUser | null>;
  logout(userId: string): Promise<number>;
  getUserByIdAndRole(userId: string, role: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  toggleBlockStatus(id: string): Promise<boolean>;
  createUser(data: IUser): Promise<IUser>;
  updateUserDetails(
    userId: string,
    updatedData: { name?: string; email?: string }
  ): Promise<IUser | null>;
  updateUserProfilePicture(userId: string, imageUrl: string): Promise<IUser>;
  findUserAndUpdateAsInstructor(data: any): Promise<IUser | null>;
  updateBankDetails(userId: string, bankDetails: IBankDetails): Promise<IUser>;
  getApplications(): Promise<any>;
  getApplication(userId: string): Promise<any>;
  changeApplicationStatus(
    userId: string,
    status: string
  ): Promise<IUser | null>;
  getUsersDataForAdmin(): Promise<any>;
}

export default IUserUsecase;
