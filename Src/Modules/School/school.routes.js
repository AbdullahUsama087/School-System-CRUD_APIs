import { Router } from "express";

import isAuth from "../../Middlewares/authentication.js";
import schoolApisRoles from "./school.endpoints.js";

import * as schoolControllers from "./school.controller.js";
import { asyncHandler } from "../../Utils/errorhandling.js";

import * as schoolValidators from "./school.validation.js";
import { validationCoreFunction } from "../../Middlewares/validation.js";

const router = Router();

router.post(
  "/add",
  isAuth(schoolApisRoles.SCHOOL_ROLE),
  validationCoreFunction(schoolValidators.addSchoolValidation),
  asyncHandler(schoolControllers.addSchool)
);

router.patch(
  "/update/:schoolId",
  isAuth(schoolApisRoles.SCHOOL_ROLE),
  validationCoreFunction(schoolValidators.updateSchoolValidation),
  asyncHandler(schoolControllers.updateSchool)
);

router.get(
  "/get",
  isAuth(schoolApisRoles.SCHOOL_ROLE),
  asyncHandler(schoolControllers.getAllSchools)
);

router.delete(
  "/delete/:schoolId",
  isAuth(schoolApisRoles.SCHOOL_ROLE),
  validationCoreFunction(schoolValidators.deleteSchoolValidation),
  asyncHandler(schoolControllers.deleteSchool)
);

export default router;
