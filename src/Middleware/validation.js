import Joi from "joi";
import { Types } from "mongoose";

const validationObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  }
  return helper.message({ message: "Invalid Id" });
};

export const generalFields = {
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  }),
  cPassword: Joi.string().valid(Joi.ref("password")),
  id: Joi.string().custom(validationObject).required(),
};

const validation = (schema) => {
  return (req, res, next) => {
    const inputsData = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    if (req.file) {
      inputsData.file = req.file;
    }

    const { error } = schema.validate(inputsData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "validation error",
        validationError: error.details,
      });
    }
    return next();
  };
};

export default validation;
