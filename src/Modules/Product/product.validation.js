import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

// product required issue
export const createProduct = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().required(),
  categoryId: generalFields.id.required(),
  subCategoryId: generalFields.id.required(),
  brandId: generalFields.id.required(),
  discount: Joi.number(),
  description: Joi.string().required(),
  stock: Joi.number().default(0),
  colors: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  sizes: Joi.alternatives().try(
    Joi.array().items(Joi.string().valid("S", "M", "L", "XL", "XXL")),
    Joi.string().valid("S", "M", "L", "XL", "XXL")
  ),

  mainImage: generalFields.file,
  subImages: Joi.array().items(Joi.object()).optional(),
}).required();

export const updateProduct = Joi.object({
  productId: generalFields.id,
  name: Joi.string().min(3),
  price: Joi.number(),
  categoryId: generalFields.id,
  subCategoryId: generalFields.id,
  brandId: generalFields.id,
  discount: Joi.number(),
  description: Joi.string(),
  stock: Joi.number(),
  colors: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  sizes: Joi.alternatives().try(
    Joi.array().items(Joi.string().valid("S", "M", "L", "XL", "XXL")),
    Joi.string().valid("S", "M", "L", "XL", "XXL")
  ),
  mainImage: generalFields.file,
  subImages: Joi.array().items(Joi.object()).optional(),
}).required();
