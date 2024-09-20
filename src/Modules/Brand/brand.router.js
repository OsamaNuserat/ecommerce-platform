import { Router } from "express";
import * as brandController from "./Controller/brand.controller.js";
import * as validators from "./brand.validation.js";
import fileupload from "../../Services/Multer.js";
import validation from "../../Middleware/validation.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
const router = Router();

router.get("/:categoryId", brandController.getAllBrands);
router.post(
  "/create",
  fileupload().single("image"),
  validation(validators.createBrand),
  asyncHandler(brandController.createBrand)
);
router.put(
  "/update/:brandId",
  fileupload().single("image"),
  validation(validators.updateBrand),
  asyncHandler(brandController.updateBrand)
);

export default router;
