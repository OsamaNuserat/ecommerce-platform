import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createBrand = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  categoryId: generalFields.id,
  file: generalFields.file,
}).required();

export const getAllBrands = Joi.object({
  categoryId: generalFields.id,
}).required();

export const updateBrand = Joi.object({
  brandId: generalFields.id,
  name: Joi.string().min(2).max(20),
  categoryId: generalFields.id,
  file: generalFields.file,
}).required();
