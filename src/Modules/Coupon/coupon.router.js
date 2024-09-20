import { Router } from "express";
import validation from "../../Middleware/validation.js";
import * as couponController from "./Controller/coupon.controller.js";
import * as validators from "./coupon.validation.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";

const router = Router();

router.post(
  "/create",
  validation(validators.createCoupon),
  asyncHandler(couponController.createCoupon)
);
router.put(
  "/update/:couponId",
  validation(validators.updateCoupon),
  asyncHandler(couponController.updateCoupon)
);
router.get("/", asyncHandler(couponController.getAllCoupons));
router.get(
  "/:couponId",
  validation(validators.getCoupon),
  asyncHandler(couponController.getCoupon)
);

export default router;
