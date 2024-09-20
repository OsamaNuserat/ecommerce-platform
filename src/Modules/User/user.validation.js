import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const profilePicSchema = {
  file: generalFields.file.required(),
};
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password.invalid(Joi.ref("oldPassword")),
    cPassword: generalFields.cPassword,
  }).required(),
};

export const shareProfileSchema = {
  params: Joi.object({
    id: generalFields.id,
  }).required(),
};
