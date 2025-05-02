import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

/**
 * @route   GET /api/auth/login
 * @desc    Redirect to Auth0 login page
 * @access  Public
 */
router.get('/login', authController.login);

/**
 * @route   GET /api/auth/callback
 * @desc    Handle Auth0 callback after login
 * @access  Public
 */
router.get('/callback', authController.callback);

/**
 * @route   GET /api/auth/logout
 * @desc    Log out user and clear session
 * @access  Public
 */
router.get('/logout', authController.logout);

/**
 * @route   GET /api/auth/session
 * @desc    Get current user session information
 * @access  Private
 */
router.get('/session', authController.getSession);

/**
 * @route   GET /api/auth/me
 * @desc    Get user profile information
 * @access  Private
 */
router.get('/me', authController.getUserInfo);

export default router;