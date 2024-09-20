import { Router } from "express";
import * as subCategoryController from "./Controller/subCategory.controller.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
import fileupload from "../../Services/Multer.js";
import validation from "../../Middleware/validation.js";
import * as validators from "./subCategory.validation.js";

const router = Router({ mergeParams: true });

router.post(
  "/create",
  fileupload().single("image"),
  validation(validators.createSubCategory),
  asyncHandler(subCategoryController.createSubCategory)
);
router.put(
  "/update/:subCategoryId",
  fileupload().single("image"),
  validation(validators.updateSubCategory),
  asyncHandler(subCategoryController.updateSubCategory)
);
router.get(
  "/",
  validation(validators.getSubCategory),
  asyncHandler(subCategoryController.getSubCategory)
);
router.get("/all", asyncHandler(subCategoryController.getAllSubCategories));
router.get(
  "/:subCategoryId",
  asyncHandler(subCategoryController.getProducts)
);

export default router;
