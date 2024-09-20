import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const signupSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required().messages({
    "any.required": "username is required",
    "string.empty": "username is required",
  }),
  email: generalFields.email,
  password: generalFields.password,
  cPassword: Joi.string().valid(Joi.ref("password")),
}).required();

export const loginSchema = Joi.object({
  email: generalFields.email,
  password: generalFields.password,
}).required();

export const token = Joi.object({
  token: Joi.string().required(),
});
export const sendResetCode = Joi.object({
  email: generalFields.email,
});
export const enterResetCode = Joi.object({
  code: Joi.string().min(1).max(4).required(),
});
export const resetPassword = Joi.object({
  token: Joi.string().required(),
  password: generalFields.password,
  cPassword: Joi.string().valid(Joi.ref("password")),
});
