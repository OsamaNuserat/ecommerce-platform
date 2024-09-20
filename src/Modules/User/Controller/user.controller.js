import userModel from "../../../../DB/Model/user.model.js";
import Cloudinary from "../../../Services/Cloudinary.js";
import {
  comparePassword,
  hashPassword,
} from "../../../Services/HashAndCompare.js";

export const profilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new Error("Profile pic is required"));
    }

    const user = await userModel.findById(req.id);

    if (!user) {
      return next(new Error("User not found"));
    }

    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `user/${req.id}/profile`,
      }
    );

    if (user.profilePicId) {
      await Cloudinary.uploader.destroy(user.profilePicId);
    }

    const updateResult = await userModel.updateOne(
      { _id: req.id },
      { profilePic: secure_url, profilePicId: public_id },
      { new: false }
    );

    if (updateResult.nModified === 0) {
      return next(new Error("Failed to update profile picture"));
    }

    return res.status(200).json({
      message: "Profile Pic updated successfully",
      secure_url,
      public_id,
    });
  } catch (error) {
    console.error("Error in profilePic:", error);
    next(error);
  }
};

export const coverPic = (req, res, next) => {
  return res.json({ message: "coverpic" });
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.id);
  const match = comparePassword(oldPassword, user.password);

  if (!match) {
    return next(new Error("Old password is incorrect"));
  }
  const newHashedPassword = hashPassword(newPassword);
  const updateResult = await userModel.updateOne(
    { _id: req.id },
    { password: newHashedPassword }
  );
  return res.json({ message: "Password updated successfully" });
};

export const shareProfile = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (!user) {
    return next(new Error("User not found"));
  }

  return res.json({ message: "Profile shared successfully", user });
};
