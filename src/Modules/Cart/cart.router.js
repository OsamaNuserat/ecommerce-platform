import { Router } from "express";
import validation from "../../Middleware/validation.js";
import * as cartController from "./Controller/cart.controller.js";
import * as validators from "./cart.validation.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
import auth, { roles } from "../../Middleware/auth.js";

const router = Router();

router.post(
  "/create",
  auth(Object.values(roles)),
  validation(validators.createCart),
  asyncHandler(cartController.createCart)
);

router.patch(
  "/deleteItem",
  auth(Object.values(roles)),
  cartController.deleteItem
);
router.patch(
  "/clearCart",
  auth(Object.values(roles)),
  cartController.clearCart
);
router.get("/", auth(Object.values(roles)), cartController.getCart);

export default router;
