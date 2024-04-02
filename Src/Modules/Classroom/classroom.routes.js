import { Router } from "express";

const router = Router();

import * as classroomControllers from "./classroom.controller.js";
import { asyncHandler } from "../../Utils/errorhandling.js";

import * as classroomValidators from "./classroom.validation.js";
import { validationCoreFunction } from "../../Middlewares/validation.js";

import isAuth from "../../Middlewares/authentication.js";
import classroomApisRoles from "./classroom.endpoints.js";

router.post(
  "/add",
  isAuth(classroomApisRoles.CLASSROOM_ROLE),
  validationCoreFunction(classroomValidators.addClassroomValidation),
  asyncHandler(classroomControllers.addClassroom)
);

router.patch(
  "/update",
  isAuth(classroomApisRoles.CLASSROOM_ROLE),
  validationCoreFunction(classroomValidators.updateClassroomValidation),
  asyncHandler(classroomControllers.updateClassroom)
);

router.get(
  "/get",
  isAuth(classroomApisRoles.CLASSROOM_ROLE),
  asyncHandler(classroomControllers.getAllClassrooms)
);

router.delete(
  "/delete",
  isAuth(classroomApisRoles.CLASSROOM_ROLE),
  validationCoreFunction(classroomValidators.deleteClassroomValidation),
  asyncHandler(classroomControllers.deleteClassroom)
);

export default router;
