import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createCategory = Joi.object({
  name: Joi.string().min(3).required(),
  file: generalFields.file.required(),
});

export const updateCategory = Joi.object({
  id: generalFields.id,
  name: Joi.string().min(3),
  file: generalFields.file,
});

export const getCategory = Joi.object({
  categoryId: generalFields.id,
});
