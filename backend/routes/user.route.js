import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import { authUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
    '/register',
    [
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('username').notEmpty().withMessage('Username is required'),
    ],
    userController.createUserController
);

router.post(
    '/login',
    [
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    userController.loginController
);

router.get('/logout', authUser, userController.logoutController);

router.get('/:userId', authUser, userController.getUserByIdController);


export default router;
