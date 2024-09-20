import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createSubCategory = Joi.object({
  categoryId: generalFields.id,
  name: Joi.string().min(2).max(20).required(),
  file: generalFields.file.required(),
});

export const updateSubCategory = Joi.object({
  categoryId: generalFields.id,
  subCategoryId: generalFields.id,
  name: Joi.string().min(2).max(20),
  file: generalFields.file,
});

export const getSubCategory = Joi.object({
  categoryId: generalFields.id,
});
export const getProducts = Joi.object({
  subCategoryId: generalFields.id,
});
