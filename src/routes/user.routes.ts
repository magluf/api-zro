import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router
  .route('/')
  .post(UserController.createUser)
  .get(UserController.getAllUsers);

router
  .route('/:id')
  .get(UserController.getUser)
  .put(UserController.updatedUser)
  .delete(UserController.deleteUser);

export default router;
