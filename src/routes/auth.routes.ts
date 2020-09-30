import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.route('/login').post(AuthController.login);

export default router;
