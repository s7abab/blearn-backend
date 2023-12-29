import sendMail from "../frameworks/utils/sendMail";
import {
  IActivationRequest,
  IBankDetails,
  ILoginRequest,
  IRegisterUser,
} from "../interfaces/user.interface";
import UserRepository from "../repositories/user.repository";
import JwtService from "../frameworks/utils/jwt";
import EventPublisher from "../frameworks/rabbitmq/publisher";
import IUser from "../entities/user";
import { Exchanges } from "../frameworks/rabbitmq/exchanges";
import { Topics } from "../frameworks/rabbitmq/topics";

class UserUsecase {
  private userRepository: UserRepository;
  private jwt: JwtService;
  private eventPublisher: EventPublisher;

  constructor(
    userRepository: UserRepository,
    jwt: JwtService,
    eventPublisher: EventPublisher
  ) {
    this.userRepository = userRepository;
    this.jwt = jwt;
    this.eventPublisher = eventPublisher;
  }

  public async register(userData: IRegisterUser) {
    try {
      if (userData.password !== userData.confirmpassword) {
        throw new Error("Password not match");
      }

      const isEmailExist = await this.getUserByEmail(userData.email);

      if (isEmailExist) {
        throw new Error("User alredy exist");
      }

      const user: IRegisterUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };

      const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const token = await this.jwt.createActivationCode(user, activationCode);
      const data = { user: { name: user.name }, activationCode };
      console.log(activationCode);

      try {
        await sendMail({
          email: user.email,
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data,
        });
        const activationToken = token.token;
        return activationToken;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  public async activateUser(data: IActivationRequest) {
    try {
      const newUser = await this.jwt.verifyActivationCode(data);
      if (newUser.activationCode !== data.activation_code) {
        throw new Error("Invalid activation code");
      }

      const { name, email, password } = newUser.user;

      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error("User already exist");
      }
      const user: IUser = await this.createUser({
        name,
        email,
        password,
      } as IUser);
    } catch (error) {
      throw error;
    }
  }

  public async socialAuth(data: IUser) {
    try {
      const user = await this.getUserByEmail(data.email);
      let token;
      if (!user) {
        const newUser = await this.createUser(data);
        token = await this.jwt.createToken(newUser);
      }
      token = await this.jwt.createToken(user as IUser);
      return token;
    } catch (error) {
      throw error;
    }
  }

  public async login(data: ILoginRequest) {
    const user = await this.getUserByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user?.isBlock) {
      throw new Error("You are blocked by admin");
    }
    const isPasswordMatched = await this.compareUserPassword(
      data.email,
      data.password
    );
    if (!isPasswordMatched) {
      throw new Error("Invalid email or password");
    }
    const token = await this.jwt.createToken(user);
    return token;
  }

  public async compareUserPassword(email: string, password: string) {
    try {
      const isPasswordMatched =
        await this.userRepository.findByEmailAndComparePassword(
          email,
          password
        );
      return isPasswordMatched;
    } catch (error) {
      throw error;
    }
  }

  public async getUsersByRole(role: string) {
    try {
      const users = await this.userRepository.findByRole(role);
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async getOneUser(userId: string) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async logout(userId: string) {
    try {
      const logoutUser = await this.userRepository.findUserAndDeleteFromRedis(
        userId
      );
      return logoutUser;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByIdAndRole(userId: string, role: string) {
    try {
      const user = await this.userRepository.findByIdAndRole(userId, role);
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user as IUser | null;
    } catch (error) {
      throw error;
    }
  }

  public async toggleBlockStatus(id: string) {
    try {
      const user = await this.userRepository.findByIdAndBlock(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user.isBlock;
    } catch (error) {
      throw error;
    }
  }

  public async createUser(data: IUser) {
    try {
      const user = await this.userRepository.create(data);
      if (!user) throw new Error("User not created");
      // publish user create event
      await this.eventPublisher.publish(
        Exchanges.USER_EXCHANGE,
        Topics.USER_CREATE,
        {
          topic: Topics.USER_CREATE,
          _id: user._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
        }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserDetails(
    userId: string,
    updatedData: { name?: string; email?: string }
  ) {
    try {
      const updatedUser = await this.userRepository.findByIdAndUpdate(
        userId,
        updatedData
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }
      const data = {
        topic: Topics.USER_UPDATE,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      };
      // publish user updated event
      await this.eventPublisher.publish(
        Exchanges.USER_EXCHANGE,
        Topics.USER_UPDATE,
        data
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserProfilePicture(userId: string, imageUrl: string) {
    try {
      const user = await this.userRepository.findByIdAndUpdateAvatar(
        userId,
        imageUrl
      );
      if (!user) {
        throw new Error("User not updated");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findUserAndUpdateAsInstructor(data: any) {
    try {
      const user = await this.userRepository.findByIdAndMakeInstructor(data);
      if (!user) {
        throw new Error("User not updated");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateBankDetails(userId: string, bankDetails: IBankDetails) {
    try {
      const user = await this.userRepository.findByIdAndUpdateBankDetails(
        userId,
        bankDetails
      );
      if (!user) {
        throw new Error("Bank details not updated");
      }
      console.log(user);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserUsecase;
