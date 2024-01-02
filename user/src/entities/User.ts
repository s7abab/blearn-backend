import appicationStatus from "../enums/applicationStatus.enum";
import { IBankDetails } from "../interfaces/user.interface";

interface IUser {
  _id: any;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  additional_info: [{}];
  isBlock: boolean;
  bankDetails?: IBankDetails;
  applicationStatus: appicationStatus;
}

export default IUser;
