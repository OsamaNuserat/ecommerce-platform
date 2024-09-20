import { Router } from "express";
import * as userController from "./Controller/user.controller.js";
import auth from "../../Middleware/auth.js";
import fileupload from "../../Services/Multer.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
import validation from "../../Middleware/validation.js";
import * as validators from './user.validation.js'
const router = Router();

router.patch(
  "/profilepic",
  auth(),
  fileupload().single("image"),
  validation(validators.profilePicSchema),
  asyncHandler(userController.profilePic)
);
router.patch(
  "/coverpic",
  auth(),
  fileupload().array("image", 4),
  asyncHandler(userController.coverPic)
);
router.patch('/updatepassword' , auth() , validation(validators.updatePasswordSchema) , asyncHandler(userController.updatePassword))
router.get('/:id/share' , asyncHandler(userController.shareProfile)) 

export default router;
