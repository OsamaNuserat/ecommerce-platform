import { Router } from 'express';
import * as reviewController from './Controller/review.controller.js';
import { asyncHandler } from '../../Services/ErrorHandling.js';
const router = Router();

router.post('/create', asyncHandler(reviewController.createReview));
export default router;