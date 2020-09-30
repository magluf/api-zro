import { Router } from 'express';
import { protect } from '../controllers/auth.controller';
import LocationController from '../controllers/location.controller';

const router = Router();

router.route('/').post(protect, LocationController.createLocation);

router.route('/all/:type').get(protect, LocationController.getAllLocations);

// Routes below are not in the scope of the challenge, but have been implemented.

// router
//   .route('/:id')
//   .get(LocationController.getLocation)
//   .put(LocationController.updatedLocation)
//   .delete(LocationController.deleteLocation);

export default router;
