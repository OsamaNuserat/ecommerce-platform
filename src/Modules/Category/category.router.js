import { Router } from "express";
import * as categoryController from "./Controller/category.controller.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
import fileupload from "../../Services/Multer.js";
import subCategory from "../subCategory/subCategory.router.js";
import validation from "../../Middleware/validation.js";
import * as validators from "./category.validation.js";
import auth from "../../Middleware/auth.js";
import { endPoints } from "./category.endpoint.js";

const router = Router();

router.use("/:categoryId/subCategory", subCategory);

router.post(
  "/create",
  auth(endPoints.create),
  fileupload().single("image"),
  validation(validators.createCategory),
  asyncHandler(categoryController.createCategory)
);
router.put(
  "/update/:id",
  fileupload().single("image"),
  validation(validators.updateCategory),
  asyncHandler(categoryController.updateCategory)
);
router.get(
  "/:categoryId",
  validation(validators.getCategory),
  asyncHandler(categoryController.getCategory)
);
router.get("/", asyncHandler(categoryController.getAllCategories));
export default router;
