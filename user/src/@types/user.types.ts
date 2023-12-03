export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  confirmpassword?: string
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISocialAuthBody {
  name: string;
  email: string;
  avatar?: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfilePicture {
  imageUrl: string;
}