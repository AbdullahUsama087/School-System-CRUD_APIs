import Joi from "joi";
import { Types } from "mongoose";

const requestMethods = ["body", "query", "params", "headers", "file", "files"];

function objectIdValidation(value, helper) {
  Types.ObjectId.isValid(value) ? true : helper.message("Invalid ID");
}

function validationCoreFunction(schema) {
  return (req, res, next) => {
    const validationErrorArr = [];
    for (const key of requestMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details);
        }
      }
    }
    if (validationErrorArr.length) {
      res.status(400).json({ message: "Validation error", validationErrorArr });
    } else {
      next();
    }
  };
}

const generalFields = {
  userName: Joi.string().min(3).max(25),
  email: Joi.string().email({ tlds: { allow: ["com", "net", "org"] } }),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      "string.pattern.base": "Password regex fail",
    }),
  id: Joi.string().custom(objectIdValidation),
};

export { generalFields, validationCoreFunction };
