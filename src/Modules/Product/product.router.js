import { Router } from "express";
import * as productController from "./Controller/product.controller.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
import * as validators from "./product.validation.js";
import fileupload from "../../Services/Multer.js";
import { endPoints } from "./product.endpoint.js";
import validation from "../../Middleware/validation.js";
import auth from "../../Middleware/auth.js";
const router = Router();

router.post(
  "/create",
  auth(endPoints.create),
  fileupload().fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  validation(validators.createProduct),
  asyncHandler(productController.createProduct)
);
router.put(
  "/update/:productId",
  auth(endPoints.update),
  fileupload().fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  validation(validators.updateProduct),
  asyncHandler(productController.updateProduct)
);
router.patch(
  "/soft-delete/:productId",
  auth(endPoints.softDelete),
  asyncHandler(productController.softDeleteProduct)
);
router.delete(
  "/delete/:productId",
  auth(endPoints.delete),
  asyncHandler(productController.deleteProduct)
);
router.patch(
  "/restore/:productId",
  auth(endPoints.restore),
  asyncHandler(productController.restoreProduct)
);
router.get(
  "/soft-deleted-products",
  auth(endPoints.get),
  asyncHandler(productController.getSoftDeletedProducts)
);
router.get('/:productId', asyncHandler(productController.getProduct));
router.get("/all", asyncHandler(productController.getAllProducts));
export default router;
