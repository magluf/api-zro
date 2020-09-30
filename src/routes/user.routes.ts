import { Router } from 'express';
import { protect } from '../controllers/auth.controller';
import UserController from '../controllers/user.controller';

const router = Router();

router.route('/').post(UserController.createUser);

// Routes below are not in the scope of the challenge, but have been implemented.
// .get(protect, UserController.getAllUsers);

// router
//   .route('/:id')
//   .get(UserController.getUser)
//   .put(UserController.updatedUser)
//   .delete(UserController.deleteUser);

export default router;
