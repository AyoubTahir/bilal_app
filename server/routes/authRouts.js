import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/confirm-email/:id/:token', authController.confirmEmail);
router.post('/forgot-password', authController.forgotPassword);
router.get('/forgot-password-check/:id/:token', authController.checkForgotPassword);
router.put('/update-password', authController.updatePassword);
//
export default router;
