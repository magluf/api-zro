import { Router } from 'express';
import { protect } from '../controllers/auth.controller';
import RatingController from '../controllers/rating.controller';

const router = Router();

router
  .route('/:locationId')
  .post(protect, RatingController.createRating)
  .get(protect, RatingController.getRatingsByLocation);

export default router;
