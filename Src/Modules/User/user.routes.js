import { Router } from "express";

import * as userController from "./user.controller.js";

import * as userValidation from "./user.validationSchemas.js";

import { asyncHandler } from "../../Utils/errorhandling.js";
import isAuth from "../../Middlewares/authentication.js";
import { validationCoreFunction } from "../../Middlewares/validation.js";

const router = Router();

// function passed() {
//   return (req, res, next) => {
//     let flag = false;
//     if (flag) {
//       next();
//     } else {
//       res.json({ message: "Middleware error" });
//     }
//   };
// }

router.post(
  "/signUp",
  validationCoreFunction(userValidation.signUpValidationSchema),
  asyncHandler(userController.signUp)
);

router.get("/confirmEmail/:token", asyncHandler(userController.confirmEmail));

router.post(
  "/signIn",
  validationCoreFunction(userValidation.signInValidationSchema),
  asyncHandler(userController.signIn)
);

router.put(
  "/updateProf/:userId",
  isAuth(),
  validationCoreFunction(userValidation.updateProfileValidationSchema),
  asyncHandler(userController.updateProfile)
);

router.get(
  "/getProfile/:_id",
  validationCoreFunction(userValidation.getProfileDataValidationSchema),
  asyncHandler(userController.getProfileData)
);

router.delete(
  "/deleteProfile",
  isAuth(),
  validationCoreFunction(userValidation.deleteProfileValidationSchema),
  asyncHandler(userController.deleteProfile)
);

router.post("/token", asyncHandler(userController.verifyTokenTry));

export default router;
