import mongoose, { Schema } from "mongoose";
import systemRoles from "../../Src/Utils/systemRoles.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    isConfirmed: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    role: {
      type: String,
      enum: [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
      default: systemRoles.USER,
    },
    token: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
