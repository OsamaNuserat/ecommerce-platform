import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createCoupon = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  amount: Joi.number().positive().min(1).max(100).required(),
  expireDate: Joi.date(),
}).required();

export const updateCoupon = Joi.object({
  couponId: generalFields.id,
  name: Joi.string().min(2).max(20),
  amount: Joi.number().positive().min(1).max(100),
}).required();

export const getCoupon = Joi.object({
  couponId: generalFields.id,
}).required();
