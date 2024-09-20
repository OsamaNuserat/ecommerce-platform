import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createCart = Joi.object({
  productId: generalFields.id.required(),
  quantity: Joi.number().required(),
}).required();
