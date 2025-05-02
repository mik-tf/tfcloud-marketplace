import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { checkRole, ROLES, jwtCheck } from '../middleware/auth';

const router = express.Router();
const paymentController = new PaymentController();

/**
 * @route   POST /api/payments/create-intent
 * @desc    Create a payment intent
 * @access  Private (cloud-user)
 */
router.post(
  '/create-intent',
  checkRole(ROLES.CLOUD_USER),
  paymentController.createPaymentIntent
);

/**
 * @route   GET /api/payments/methods
 * @desc    Get user's payment methods
 * @access  Private (cloud-user)
 */
router.get(
  '/methods',
  checkRole(ROLES.CLOUD_USER),
  paymentController.getPaymentMethods
);

/**
 * @route   POST /api/payments/methods
 * @desc    Add a payment method
 * @access  Private (cloud-user)
 */
router.post(
  '/methods',
  checkRole(ROLES.CLOUD_USER),
  paymentController.addPaymentMethod
);

/**
 * @route   DELETE /api/payments/methods/:id
 * @desc    Delete a payment method
 * @access  Private (cloud-user)
 */
router.delete(
  '/methods/:id',
  checkRole(ROLES.CLOUD_USER),
  paymentController.deletePaymentMethod
);

/**
 * @route   GET /api/payments/transactions
 * @desc    Get user's transaction history
 * @access  Private (cloud-user)
 */
router.get(
  '/transactions',
  checkRole(ROLES.CLOUD_USER),
  paymentController.getTransactionHistory
);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

export default router;