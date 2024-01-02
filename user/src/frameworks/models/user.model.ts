require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IBankDetails } from "../../interfaces/user.interface";
import appicationStatus from "../../enums/applicationStatus.enum";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export interface IUserSchema extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  additional_info: [{}];
  isBlock: boolean;
  bankDetails: IBankDetails;
  applicationStatus: appicationStatus;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema<IUserSchema> = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email"],
      validate: {
        validator: function (value: string) {
          return emailRegex.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    bankDetails: {
      type: { name: String, accountNumber: Number, ifscCode: Number },
    },
    avatar: { type: String },
    role: {
      type: String,
      default: "user",
    },
    applicationStatus: {
      type: String,
      enum: [
        appicationStatus.NONE,
        appicationStatus.PENDING,
        appicationStatus.APPROVED,
        appicationStatus.REJECTED,
      ],
      default: appicationStatus.NONE,
    },
    additional_info: { type: [{}] },
    isBlock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre<IUserSchema>("save", async function (next: any) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// comapre password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUserSchema> = mongoose.model<IUserSchema>(
  "User",
  userSchema
);
export default userModel;
