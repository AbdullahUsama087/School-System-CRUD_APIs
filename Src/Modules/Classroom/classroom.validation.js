import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

const addClassroomValidation = {
  body: Joi.object({
    name: Joi.string().min(5).max(25).required(),
  }).required(),
  query: Joi.object({
    schoolId: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

const updateClassroomValidation = {
  body: Joi.object({
    name: Joi.string().min(5).max(25).required(),
  }).required(),
  query: Joi.object({
    schoolId: generalFields.id,
    classroomId: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

const deleteClassroomValidation = {
  quey: Joi.object({
    schoolId: generalFields.id,
    classroomId: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

export {
  addClassroomValidation,
  updateClassroomValidation,
  deleteClassroomValidation,
};
