import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
    profilePicId: String,
    coverPic: [String],
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    code: {
      type: String,
      default: null,
    },
    codeToken : {
      type: String,
      default: null,
    },
    changePasswordTime: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
