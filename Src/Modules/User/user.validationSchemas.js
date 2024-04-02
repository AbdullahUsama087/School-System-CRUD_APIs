import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";
import systemRoles from "../../Utils/systemRoles.js";

const signUpValidationSchema = {
  body: Joi.object({
    userName: Joi.string().max(20).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    age: Joi.number().positive().integer().optional(),
    gender: Joi.string().valid("Male", "Female").optional(),
    role: Joi.string()
      .valid(systemRoles.SUPER_ADMIN, systemRoles.ADMIN, systemRoles.USER)
      .required(),
  }).required(),
};

const signInValidationSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net", "org"] } })
      .required(),
    password: Joi.string().regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    ),
  })
    .options({ presence: "required" })
    .required(),
};

const updateProfileValidationSchema = {
  body: Joi.object({
    userName: generalFields.userName,
    newEmail: generalFields.email,
    newPassword: generalFields.password,
  })
    .required()
    .options({ presence: "optional" }),
  params: Joi.object({
    userId: generalFields.id.required(),
  }).required(),
  authUser: Joi.object({
    email: generalFields.email,
    _id: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

const getProfileDataValidationSchema = {
  query: Joi.object({
    _id: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

const deleteProfileValidationSchema = {
  authUser: Joi.object({
    email: generalFields.email,
    _id: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

export {
  signUpValidationSchema,
  signInValidationSchema,
  updateProfileValidationSchema,
  getProfileDataValidationSchema,
  deleteProfileValidationSchema,
};
