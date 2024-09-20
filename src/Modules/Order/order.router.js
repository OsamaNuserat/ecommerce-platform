import { Router } from 'express';
import * as orderController from './Controller/order.controller.js';
import { asyncHandler } from '../../Services/ErrorHandling.js';
const router = Router();

router.post('/create', asyncHandler(orderController.createOrder));
router.post('/create-with-cart' , asyncHandler(orderController.createOrderWithCart));
router.patch('/cancel/:orderId', asyncHandler(orderController.cancelOrder));
export default router;