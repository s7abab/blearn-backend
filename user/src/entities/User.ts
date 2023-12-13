interface User {
  _id: any;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  additional_info?: [{}];
  isBlock: boolean;
}

export default User;
