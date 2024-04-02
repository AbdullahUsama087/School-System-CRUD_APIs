import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

const addSchoolValidation = {
  body: Joi.object({
    name: Joi.string().min(5).max(25).required(),
  }).required(),
};

const updateSchoolValidation = {
  body: Joi.object({
    name: Joi.string().min(5).max(25).optional(),
  }).required(),
  params: Joi.object({
    schoolId: generalFields.id.required(),
  }).required(),
};

const deleteSchoolValidation = {
  params: Joi.object({
    schoolId: generalFields.id.required(),
  }).required(),
};

export { addSchoolValidation, updateSchoolValidation, deleteSchoolValidation };
